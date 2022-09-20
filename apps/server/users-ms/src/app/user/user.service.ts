import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '@nx-mfe/server/common';
import { RpcException } from '@nx-mfe/server/grpc';
import { isNil, isUndefined } from '@nx-mfe/shared/common';
import { DeepPartial, Repository } from 'typeorm';
import * as uuid from 'uuid';

import { IUserService } from '../abstractions/user-service.interface';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repository: Repository<UserEntity>
  ) {}

  public async findOne(criterias: DeepPartial<UserEntity>): Promise<UserEntity> {
    const user = await this._repository.findOne({ where: { ...criterias } });

    if (isNil(user)) {
      throw new RpcException({ code: status.NOT_FOUND, message: 'User doesn`t found' });
    }

    return user;
  }

  // TODO credential dto
  public async create(userData: Pick<UserEntity, 'email' | 'password'>): Promise<UserEntity> {
    const isExist = await this._repository
      .createQueryBuilder()
      .where({ email: userData.email })
      .getOne()
      .then((v) => !isUndefined(v));

    if (isExist) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'Email already used',
      });
    }

    try {
      const newUser = this._repository.create();
      newUser.email = userData.email;
      newUser.password = await hashPassword(userData.password);
      newUser.confirmationLink = uuid.v4();

      const result = await this._repository
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values([newUser])
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error,
      });
    }
  }

  public async update(id: number, userData: DeepPartial<UserEntity>): Promise<UserEntity> {
    const result = await this._repository
      .createQueryBuilder()
      .update({ ...userData })
      .where({ id })
      .returning('*')
      .execute();

    return result.raw[0];
  }

  public async delete(id: number): Promise<void> {
    await this._repository.delete(id);
  }

  public async issueNewConfirmationLink(email: string): Promise<string> {
    // const user = await this._repository.findOne({ where: { email } });

    // if (!user) {
    //   throw new RpcException(`User with E-mail ${email} does not found`);
    // }

    // const confirmationLink = uuid.v4();
    // user.confirmationLink = confirmationLink;

    // return this._repository.save(user);

    const result = await this._repository
      .createQueryBuilder()
      .update({ confirmationLink: uuid.v4() })
      .where({ email })
      .returning('confirmationLink')
      .execute();

    return result.raw[0];
  }
}

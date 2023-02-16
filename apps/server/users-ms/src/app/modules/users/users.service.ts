import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '@nx-mfe/server/common';
import { GrpcException } from '@nx-mfe/server/grpc';
import { isNil, isUndefined } from '@nx-mfe/shared/common';
import { DeepPartial, Repository } from 'typeorm';

import { IUsersService } from '../../abstractions/users-service.interface';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repository: Repository<UserEntity>
  ) {}

  public async findOne(criterias: DeepPartial<UserEntity>): Promise<UserEntity> {
    const user = await this._repository.findOne({ where: { ...criterias } });

    if (isNil(user)) {
      throw new GrpcException({ code: status.NOT_FOUND, message: 'User doesn`t found' });
    }

    return user;
  }

  // TODO credential dto
  public async create(userData: Pick<UserEntity, 'email' | 'password'>): Promise<UserEntity> {
    // BUG всегда при регистрации кидает что пользователь уже есть
    const isExists = await this._repository
      .createQueryBuilder()
      .where({ email: userData.email })
      .getOne()
      .then((v) => !isUndefined(v));

    if (isExists) {
      throw new GrpcException({
        code: status.ALREADY_EXISTS,
        message: 'Email already used',
      });
    }

    try {
      const newUser = this._repository.create();
      newUser.email = userData.email;
      newUser.password = await hashPassword(userData.password);

      const result = await this._repository
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values([newUser])
        .returning('*')
        .execute();

      return result.raw[0];
    } catch (error) {
      throw new GrpcException({
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
}

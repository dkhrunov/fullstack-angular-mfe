import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hasOwnProperty } from '@nx-mfe/shared/common';
import { DeepPartial, Repository } from 'typeorm';
import * as uuid from 'uuid';

import { hashPassword } from '../shared/helpers/hash';
import { UserEntity } from './user.entity';
import { IUserService } from './user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>
  ) {}

  public findOne(criteria: { id: number }): Promise<UserEntity | undefined>;
  public findOne(criteria: { email: string }): Promise<UserEntity | undefined>;
  public findOne(criteria: { confirmationLink: string }): Promise<UserEntity | undefined>;
  public findOne(
    criteria: { id: number } | { email: string } | { confirmationLink: string }
  ): Promise<UserEntity | undefined> {
    if (hasOwnProperty(criteria, 'email')) {
      return this._userRepository.findOne({ where: { email: criteria.email } });
    }

    if (hasOwnProperty(criteria, 'confirmationLink')) {
      return this._userRepository.findOne({
        where: { confirmationLink: criteria.confirmationLink },
      });
    }

    if (hasOwnProperty(criteria, 'id')) {
      return this._userRepository.findOne(criteria.id);
    }

    throw new BadRequestException('Should provide correct criteria to UserService.findOne method');
  }

  public getById(id: number): Promise<UserEntity | undefined> {
    return this._userRepository.findOne(id);
  }

  public getByEmail(email: string): Promise<UserEntity | undefined> {
    return this._userRepository.findOne({ where: { email } });
  }

  public getByConfirmationLink(confirmationLink: string): Promise<UserEntity | undefined> {
    return this._userRepository.findOne({ where: { confirmationLink } });
  }

  public async create(userData: DeepPartial<UserEntity>): Promise<UserEntity> {
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }

    userData.confirmationLink = uuid.v4();

    return this._userRepository.create(userData);
  }

  public async issueNewConfirmationLink(email: string): Promise<UserEntity> {
    const user = await this.getByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with E-mail ${email} does not found`);
    }

    const confirmationLink = uuid.v4();
    user.confirmationLink = confirmationLink;

    return this.update(user.id, user);
  }

  public update(id: number, userData: DeepPartial<UserEntity>): Promise<UserEntity> {
    return this._userRepository.update(id, userData).then((res) => res.raw[0]);
  }
}

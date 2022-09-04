import { DeepPartial } from 'typeorm';

import { UserEntity } from './user.entity';

export interface IUserService {
  getById(id: number): Promise<UserEntity | undefined>;

  getByEmail(email: string): Promise<UserEntity | undefined>;

  getByConfirmationLink(confirmationLink: string): Promise<UserEntity | undefined>;

  create(userData: DeepPartial<UserEntity>): Promise<UserEntity>;

  issueNewConfirmationLink(id: number): Promise<UserEntity>;
  issueNewConfirmationLink(email: string): Promise<UserEntity>;
  issueNewConfirmationLink(idOrEmail: number | string): Promise<UserEntity>;
  issueNewConfirmationLink(idOrEmail: number | string): Promise<UserEntity>;

  createAndSave(userData: DeepPartial<UserEntity>): Promise<UserEntity>;

  update(id: number, userData: DeepPartial<UserEntity>): Promise<void>;
}

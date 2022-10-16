import { DeepPartial } from 'typeorm';

// TODO мне не нравиться эта зависимость от БД сущности
import { UserEntity } from '../users/user.entity';

// TODO Вынести Promise<UserEntity> в DTO
export interface IUsersService {
  findOne(criterias: DeepPartial<UserEntity>): Promise<UserEntity>;

  // TODO Вынести в DTO
  create(userData: Pick<UserEntity, 'email' | 'password'>): Promise<UserEntity>;

  // TODO Вынести в DTO
  update(id: number, userData: DeepPartial<UserEntity>): Promise<UserEntity>;

  delete(id: number): Promise<void>;
}

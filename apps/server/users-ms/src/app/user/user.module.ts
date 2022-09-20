import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Services } from '../constants/services';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

const USER_SERVICE_PROVIDER = {
  provide: Services.USER_SERVICE,
  useClass: UserService,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [USER_SERVICE_PROVIDER],
  exports: [USER_SERVICE_PROVIDER],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Services } from '../../constants/services';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const USER_SERVICE_PROVIDER = {
  provide: Services.USER_SERVICE,
  useClass: UsersService,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [USER_SERVICE_PROVIDER],
  exports: [USER_SERVICE_PROVIDER],
})
export class UsersModule {}

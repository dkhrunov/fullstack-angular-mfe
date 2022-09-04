import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Service } from '../shared/constants/services-injection-tokens';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

const USER_SERVICE_PROVIDER = {
  provide: Service.USER,
  useClass: UserService,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [USER_SERVICE_PROVIDER],
  exports: [USER_SERVICE_PROVIDER],
})
export class UserModule {}

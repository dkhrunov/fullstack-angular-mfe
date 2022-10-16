import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Services } from '../constants';
import { TokenEntity } from './token.entity';
import { TokenService } from './token.service';

const TOKEN_SERVICE_PROVIDER = {
  provide: Services.TOKEN_SERVICE,
  useClass: TokenService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity]),
    JwtModule.register({}),
    ScheduleModule.forRoot(),
  ],
  providers: [TOKEN_SERVICE_PROVIDER],
  exports: [TOKEN_SERVICE_PROVIDER],
})
export class TokenModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Service } from '../shared/constants/services-injection-tokens';
import { TokenEntity } from './token.entity';
import { TokenService } from './token.service';

const TOKEN_SERVICE_PROVIDER = {
  provide: Service.TOKEN,
  useClass: TokenService,
};

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity]), JwtModule.register({})],
  providers: [TOKEN_SERVICE_PROVIDER],
  exports: [TOKEN_SERVICE_PROVIDER, JwtModule],
})
export class TokenModule {}

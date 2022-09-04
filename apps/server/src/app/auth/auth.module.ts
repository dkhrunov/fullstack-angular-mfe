import { Module } from '@nestjs/common';
import { AuthModule as LibAuthModule } from '@nx-mfe/server/auth';

import { Service } from '../shared/constants/services-injection-tokens';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const AUTH_SERVICE_PROVIDER = {
  provide: Service.AUTH,
  useClass: AuthService,
};

@Module({
  imports: [UserModule, TokenModule, LibAuthModule],
  controllers: [AuthController],
  providers: [AUTH_SERVICE_PROVIDER],
})
export class AuthModule {}

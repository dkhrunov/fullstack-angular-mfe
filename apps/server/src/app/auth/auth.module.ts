import { Module } from '@nestjs/common';
import { AuthModule as _LibAuthModule } from '@nx-mfe/server/auth';

import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [UserModule, TokenModule, _LibAuthModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}

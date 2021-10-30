import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		PassportModule.register({
			defaultStrategy: 'jwt',
			property: 'user',
			session: false,
		}),
		JwtModule.register({
			secret: process.env.JWT_PRIVATE_KEY || 'SECRET_KEY',
			signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [PassportModule, JwtModule],
})
export class AuthModule {}

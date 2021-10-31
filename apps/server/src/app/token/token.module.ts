import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokenEntity } from './token.entity';
import { TokenService } from './token.service';

@Module({
	providers: [TokenService],
	imports: [
		TypeOrmModule.forFeature([TokenEntity]),
		JwtModule.register({
			secret: process.env.JWT_ACCESS_SECRET,
			signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },
		}),
	],
	exports: [TokenService, JwtModule],
})
export class TokenModule {}

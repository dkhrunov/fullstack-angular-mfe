import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthTokensDto } from '@nx-mfe/shared/data-access';
import { Repository } from 'typeorm';

import { TokenEntity } from './token.entity';

@Injectable()
export class TokenService {
	constructor(
		@InjectRepository(TokenEntity)
		private readonly _tokenRepository: Repository<TokenEntity>,
		private readonly _jwtService: JwtService
	) {}

	public generateTokens<P extends string | Record<string, any>>(payload: P): AuthTokensDto {
		const accessToken = this._jwtService.sign(payload, {
			secret: process.env.JWT_ACCESS_SECRET,
			expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
		});

		const refreshToken = this._jwtService.sign(payload, {
			secret: process.env.JWT_REFRESH_SECRET,
			expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
		});

		return new AuthTokensDto(accessToken, refreshToken);
	}

	// TODO: продумать очистку
	public async saveRefreshToken(userId: number, refreshToken: string): Promise<TokenEntity> {
		const token = await this._tokenRepository.findOne({ where: { userId } });

		if (token) {
			const updateResult = await this._tokenRepository.update(token.id, { refreshToken });
			return updateResult.raw[0] as TokenEntity;
		}

		const createdToken = this._tokenRepository.create({ userId, refreshToken });
		return this._tokenRepository.save(createdToken);
	}
}

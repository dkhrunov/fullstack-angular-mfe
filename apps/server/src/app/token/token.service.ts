import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
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

	// eslint-disable-next-line @typescript-eslint/ban-types
	public generateTokens<P extends Object>(payload: P): AuthTokensDto {
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

	public async upsertRefreshToken(userId: number, oldToken: string, newToken: string): Promise<TokenEntity> {
		const token = await this._tokenRepository.findOne({ where: { refreshToken: oldToken } });
		if (token) {
			const updateResult = await this._tokenRepository.update(token.id, { refreshToken: newToken });
			return updateResult.raw[0] as TokenEntity;
		}

		return await this.saveRefreshToken(userId, newToken);
	}

	public async saveRefreshToken(userId: number, refreshToken: string): Promise<TokenEntity> {
		const createdToken = this._tokenRepository.create({ userId, refreshToken });
		return this._tokenRepository.save(createdToken);
	}

	public async deleteRefreshToken(refreshToken: string): Promise<void> {
		await this._tokenRepository.delete({ refreshToken });
	}

	@Cron(CronExpression.EVERY_WEEK, { timeZone: 'Europe/Moscow' })
	protected async removeExpiresRefreshTokens(): Promise<void> {
		const tokens = await this._tokenRepository.find();
		const invalidTokens: TokenEntity[] = [];

		tokens.forEach((token) => {
			try {
				this._jwtService.verify(token.refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
			} catch (error) {
				invalidTokens.push(token);
			}
		});

		if (invalidTokens.length > 0) {
			await this._tokenRepository.remove(invalidTokens);
		}
	}
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthTokenPayload, AuthTokensDto } from '@nx-mfe/shared/data-access';
import { Repository } from 'typeorm';
import { TokenEntity } from './token.entity';

@Injectable()
export class TokenService {
	constructor(
		@InjectRepository(TokenEntity)
		private readonly _tokenRepository: Repository<TokenEntity>,
		private readonly _jwtService: JwtService
	) {}

	public generateTokens<P extends Record<string, any>>(payload: P): AuthTokensDto {
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

	public async saveRefreshToken(
		refreshToken: string,
		userAgent: string,
		ip: string
	): Promise<TokenEntity> {
		const { exp: expiresIn, id: userId } = this._jwtService.decode(
			refreshToken
		) as AuthTokenPayload;
		const createdToken = this._tokenRepository.create({
			refreshToken,
			expiresIn,
			userId,
			userAgent,
			ip,
		});
		return this._tokenRepository.save(createdToken);
	}

	public async findRefreshToken(refreshToken: string): Promise<TokenEntity | undefined> {
		return this._tokenRepository.findOne({ refreshToken });
	}

	public async deleteRefreshToken(refreshToken: string): Promise<void> {
		await this._tokenRepository.delete({ refreshToken });
	}

	public async deleteAllRefreshTokensForDevice(userId: number, userAgent: string): Promise<void> {
		await this._tokenRepository.delete({ userId, userAgent });
	}

	@Cron(CronExpression.EVERY_WEEK, { timeZone: 'Europe/Moscow' })
	protected async removeExpiresRefreshTokens(): Promise<void> {
		const tokens = await this._tokenRepository.find();
		const invalidTokens: TokenEntity[] = [];

		tokens.forEach((token) => {
			try {
				this._jwtService.verify(token.refreshToken, {
					secret: process.env.JWT_REFRESH_SECRET,
				});
			} catch (error) {
				invalidTokens.push(token);
			}
		});

		if (invalidTokens.length > 0) {
			await this._tokenRepository.remove(invalidTokens);
		}
	}
}

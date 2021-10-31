import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthTokensDto } from '@nx-mfe/shared/data-access';
import { from, map, Observable, switchMap } from 'rxjs';
import { Repository } from 'typeorm';

import { TokenEntity } from './token.entity';

@Injectable()
export class TokenService {
	constructor(
		@InjectRepository(TokenEntity)
		private readonly _tokenRepository: Repository<TokenEntity>,
		private readonly _jwtService: JwtService
	) {}

	public generateTokens<P extends string | Record<string, any>>(
		payload: P
	): AuthTokensDto {
		const accessToken = this._jwtService.sign(payload);
		const refreshToken = this._jwtService.sign(payload, {
			secret: process.env.JWT_REFRESH_SECRET,
			expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
		});

		return new AuthTokensDto(accessToken, refreshToken);
	}

	public saveRefreshToken(
		userId: number,
		refreshToken: string
	): Observable<TokenEntity> {
		return from(
			this._tokenRepository.findOne({ where: { user: userId } })
		).pipe(
			switchMap((token) => {
				if (token) {
					return from(
						this._tokenRepository.update(token.id, { refreshToken })
					).pipe(
						map(
							(updateResult) => updateResult.raw[0] as TokenEntity
						)
					);
				}

				const createdToken = this._tokenRepository.create({
					userId,
					refreshToken,
				});
				return from(this._tokenRepository.save(createdToken));
			})
		);
	}
}

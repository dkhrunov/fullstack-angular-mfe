import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokensDto, CredentialsDto, JwtTokenPayload, RegistrationUserDto } from '@nx-mfe/shared/data-access';
import * as bcrypt from 'bcrypt';

import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly _userService: UserService,
		private readonly _mailService: MailService,
		private readonly _tokenService: TokenService
	) {}

	public async login(credentials: CredentialsDto): Promise<AuthTokensDto> {
		const userEntity = await this._userService.findByEmail(credentials.email);
		if (!userEntity) {
			throw new UnauthorizedException(`Пользователь с email - ${credentials.email} не найден`);
		}

		const isPasswordCorrect = await bcrypt.compare(credentials.password, userEntity.password);
		if (!isPasswordCorrect) {
			throw new UnauthorizedException('Некоррекный пароль');
		}

		const payload: JwtTokenPayload = { ...userEntity };
		return this._tokenService.generateTokens(payload);
	}

	public async register(user: RegistrationUserDto): Promise<AuthTokensDto> {
		const candidate = await this._userService.findByEmail(user.email);
		if (candidate) {
			throw new ConflictException(`Пользователь с данным email - ${user.email} уже существует`);
		}

		const userEntity = await this._userService.create(user);
		await this._mailService.sendConfirmationMail(userEntity.email, userEntity.confirmationLink);

		const payload: JwtTokenPayload = {
			id: userEntity.id,
			email: userEntity.email,
			isConfirmed: userEntity.isConfirmed,
		};
		const tokens = this._tokenService.generateTokens(payload);
		await this._tokenService.saveRefreshToken(userEntity.id, tokens.refreshToken);

		return tokens;
	}
}

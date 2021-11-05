import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokensDto, CredentialsDto, JwtTokenPayload, RegistrationCredentialsDto } from '@nx-mfe/shared/data-access';
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
		const user = await this._userService.getByEmail(credentials.email);
		if (!user) {
			throw new UnauthorizedException(`Пользователь ${credentials.email} не найден`);
		}

		if (!user.isConfirmed) {
			throw new UnauthorizedException(`Пользователь ${credentials.email} не завершил регистрацию`);
		}

		const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
		if (!isPasswordCorrect) {
			throw new UnauthorizedException('Некоррекный пароль');
		}

		const payload: JwtTokenPayload = {
			id: user.id,
			email: user.email,
			isConfirmed: user.isConfirmed,
		};
		const tokens = this._tokenService.generateTokens(payload);
		await this._tokenService.saveRefreshToken(user.id, tokens.refreshToken);

		return tokens;
	}

	public async register(credentials: RegistrationCredentialsDto): Promise<void> {
		const candidate = await this._userService.getByEmail(credentials.email);
		if (candidate) {
			throw new ConflictException(`Пользователь с данным email - ${credentials.email} уже существует`);
		}

		const user = await this._userService.create(credentials);

		await this._mailService.sendRegisterConfirmationMail(
			user.email,
			`${process.env.SERVER_URL}:${process.env.PORT}/${process.env.GLOBAL_PREFIX}/auth/register/confirmation/${user.confirmationLink}`
		);
	}

	public async confirmRegistration(confirmationLink: string): Promise<void> {
		const user = await this._userService.getByConfirmationLink(confirmationLink);

		if (!user) {
			throw new BadRequestException('Некорректная ссылка для подтверждения регистрации');
		}

		await this._userService.update(user.id, { isConfirmed: true });
	}

	public async logout(refreshToken: string): Promise<void> {
		await this._tokenService.deleteRefreshToken(refreshToken);
	}
}

import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokensDto, CredentialsDto, JwtTokenPayload, RegistrationUserDto } from '@nx-mfe/shared/data-access';
import * as bcrypt from 'bcrypt';
import { UpdateResult } from 'typeorm';

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
		const userEntity = await this._userService.getByEmail(credentials.email);
		if (!userEntity) {
			throw new UnauthorizedException(`Пользователь ${credentials.email} не найден`);
		}

		if (!userEntity.isConfirmed) {
			throw new UnauthorizedException(`Пользователь ${credentials.email} не завершил регистрацию`);
		}

		const isPasswordCorrect = await bcrypt.compare(credentials.password, userEntity.password);
		if (!isPasswordCorrect) {
			throw new UnauthorizedException('Некоррекный пароль');
		}

		const payload: JwtTokenPayload = {
			id: userEntity.id,
			email: userEntity.email,
			isConfirmed: userEntity.isConfirmed,
		};
		const tokens = this._tokenService.generateTokens(payload);
		await this._tokenService.saveRefreshToken(userEntity.id, tokens.refreshToken);

		return tokens;
	}

	public async register(user: RegistrationUserDto): Promise<void> {
		const candidate = await this._userService.getByEmail(user.email);
		if (candidate) {
			throw new ConflictException(`Пользователь с данным email - ${user.email} уже существует`);
		}

		const userEntity = await this._userService.create(user);

		await this._mailService.sendRegisterConfirmationMail(
			userEntity.email,
			`${process.env.SERVER_URL}:${process.env.PORT}/${process.env.GLOBAL_PREFIX}/auth/register/confirmation/${userEntity.confirmationLink}`
		);
	}

	public async confirmRegistration(confirmationLink: string): Promise<UpdateResult> {
		const userEntity = await this._userService.getByConfirmationLink(confirmationLink);

		if (!userEntity) {
			throw new BadRequestException('Некорректная ссылка подтверждения регистрации');
		}

		return this._userService.update(userEntity.id, { isConfirmed: true });
	}
}

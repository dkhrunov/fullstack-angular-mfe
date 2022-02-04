import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '@nx-mfe/server/domains';
import {
	AuthTokenPayload,
	AuthTokensDto,
	CredentialsDto,
	RegistrationCredentialsDto,
} from '@nx-mfe/shared/data-access';
import * as bcrypt from 'bcrypt';

import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly _userService: UserService,
		private readonly _mailService: MailService,
		private readonly _tokenService: TokenService,
		private readonly _jwtService: JwtService
	) {}

	public async login(credentials: CredentialsDto): Promise<AuthTokensDto> {
		const user = await this._userService.getByEmail(credentials.email);
		if (!user) {
			throw new UnauthorizedException('Некорректная почта или пароль');
		}

		const isPasswordCorrect = await bcrypt.compare(
			Buffer.from(credentials.password, 'base64').toString(),
			user.password
		);
		if (!isPasswordCorrect) {
			throw new UnauthorizedException('Некорректная почта или пароль');
		}

		if (!user.isConfirmed) {
			throw new UnauthorizedException('Требуется сначала подтвердить почту');
		}

		const tokens = this._generateAuthTokens(user);
		await this._tokenService.saveRefreshToken(user.id, tokens.refreshToken);

		return tokens;
	}

	public async register(credentials: RegistrationCredentialsDto): Promise<void> {
		const candidate = await this._userService.getByEmail(credentials.email);
		if (candidate) {
			throw new ConflictException(`Пользователь с данным email уже зарегистрирован`);
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
			// TODO: редирект на страницу с ошибкой на фронте.
			throw new BadRequestException('Некорректная ссылка для подтверждения регистрации');
		}

		await this._userService.update(user.id, { isConfirmed: true });
	}

	public async logout(refreshToken: string): Promise<void> {
		if (!refreshToken) {
			return;
		}

		await this._tokenService.deleteRefreshToken(refreshToken);
	}

	public async refresh(refreshToken: string): Promise<AuthTokensDto> {
		if (!refreshToken) {
			throw new UnauthorizedException();
		}

		const token = new RefreshToken(refreshToken, this._jwtService);

		try {
			token.verify();
		} catch (error) {
			throw new UnauthorizedException(error.message);
		}

		const user = await this._userService.getById(token.decode().id);
		if (!user) {
			throw new NotFoundException(`Пользователь не найден`);
		}

		const tokens = this._generateAuthTokens(user);
		await this._tokenService.upsertRefreshToken(user.id, refreshToken, tokens.refreshToken);

		return tokens;
	}

	private _generateAuthTokens(user: UserEntity): AuthTokensDto {
		const { ...payload } = new AuthTokenPayload(user);
		return this._tokenService.generateTokens(payload);
	}
}

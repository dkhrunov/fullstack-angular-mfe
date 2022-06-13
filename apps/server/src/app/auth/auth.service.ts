import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '@nx-mfe/server/domains';
import { MailerService } from '@nx-mfe/server/mailer';
import {
	AuthTokenPayload,
	AuthTokensDto,
	CredentialsDto,
	RegistrationDto,
} from '@nx-mfe/shared/data-access';
import * as bcrypt from 'bcrypt';
import { SentMessageInfo } from 'nodemailer';
import { Connection } from 'typeorm';

import { TokenService } from '../token/token.service';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly _connection: Connection,
		private readonly _userService: UserService,
		private readonly _tokenService: TokenService,
		private readonly _jwtService: JwtService,
		private readonly _mailerService: MailerService
	) {}

	public async login(
		credentials: CredentialsDto,
		userAgent: string,
		ip: string
	): Promise<AuthTokensDto> {
		const user = await this._userService.getByEmail(credentials.email);
		if (!user) {
			throw new UnauthorizedException('Некорректная почта или пароль');
		}

		const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
		if (!isPasswordCorrect) {
			throw new UnauthorizedException('Некорректная почта или пароль');
		}

		if (!user.isConfirmed) {
			throw new UnauthorizedException('Требуется сначала подтвердить почту');
		}

		const authTokens = this._generateAuthTokens(user);
		await this._tokenService.saveRefreshToken(authTokens.refreshToken, userAgent, ip);

		return authTokens;
	}

	public async register(credentials: RegistrationDto): Promise<void> {
		const candidate = await this._userService.getByEmail(credentials.email);
		if (candidate) {
			throw new ConflictException(`Пользователь с данным email уже зарегистрирован`);
		}

		const queryRunner = this._connection.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const user = await this._userService.create(credentials);
			await queryRunner.manager.save<UserEntity>(user);
			// TODO поменять ссылку с вызова API бека на страницу на клиенте где как раз будет вызываться данный ендпоинт
			await this._sendRegisterConfirmationMail(
				user.email,
				`${process.env.SERVER_URL}:${process.env.PORT}/${process.env.GLOBAL_PREFIX}/auth/register/confirm/${user.confirmationLink}`
			);
			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new InternalServerErrorException();
		} finally {
			await queryRunner.release();
		}
	}

	public async confirmRegistration(confirmationLink: string): Promise<void> {
		const user = await this._userService.getByConfirmationLink(confirmationLink);
		if (!user) {
			// TODO редирект на страницу с ошибкой на фронте.
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

	public async refresh(
		refreshToken: string,
		userAgent: string,
		ip: string
	): Promise<AuthTokensDto> {
		const tokenEntity = await this._tokenService.findRefreshToken(refreshToken);
		if (!tokenEntity) {
			throw new UnauthorizedException('Refresh token not found');
		}

		const _refreshToken = new RefreshToken(refreshToken, this._jwtService);
		const refreshTokenPayload = _refreshToken.decode();

		const isExpired = tokenEntity.expiresIn < Math.floor(Date.now() / 1000);
		if (isExpired) {
			await this._tokenService.deleteAllRefreshTokensForDevice(
				refreshTokenPayload.id,
				userAgent
			);
			throw new UnauthorizedException('Refresh token is expired');
		}

		try {
			_refreshToken.verify();
		} catch (error) {
			throw new UnauthorizedException(error.message);
		}

		const user = await this._userService.getById(refreshTokenPayload.id);
		if (!user) {
			throw new NotFoundException(`Пользователь не найден`);
		}

		const authTokens = this._generateAuthTokens(user);
		await this._tokenService.deleteRefreshToken(refreshToken);
		await this._tokenService.saveRefreshToken(authTokens.refreshToken, userAgent, ip);

		return authTokens;
	}

	private _generateAuthTokens(user: UserEntity): AuthTokensDto {
		const { ...payload } = new AuthTokenPayload(user);
		return this._tokenService.generateTokens(payload);
	}

	private async _sendRegisterConfirmationMail(
		to: string,
		link: string
	): Promise<SentMessageInfo> {
		return await this._mailerService.sendMail({
			to,
			from: process.env.SMTP_USER,
			subject: 'Confirm account',
			text: '',
			html: `
					<div>
						<h2>Welcome to the application.</h2>
	          <p>To confirm the email address, click here: <a href="${link}">confirm email</a></p>
					</div>
				`,
		});
	}
}

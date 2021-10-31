import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { exception } from '@nx-mfe/rxjs';
import {
	AuthTokensDto,
	CreateUserDto,
	CredentialsDto,
	JwtTokenPayload,
} from '@nx-mfe/shared/data-access';
import * as bcrypt from 'bcrypt';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import * as uuid from 'uuid';

import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly _userService: UserService,
		private readonly _mailService: MailService,
		private readonly _tokenService: TokenService
	) {}

	public login(credentials: CredentialsDto): Observable<AuthTokensDto> {
		return this._userService.findByEmail(credentials.email).pipe(
			exception(
				(userEntity) => !userEntity,
				new UnauthorizedException({ message: 'Некоррекный пароль' })
			),
			switchMap((userEntity) =>
				this._comparePasswords(credentials, userEntity as UserEntity)
			),
			map((userEntity) => {
				const payload = new JwtTokenPayload(userEntity);
				return this._tokenService.generateTokens(payload);
			})
		);
	}

	public register(user: CreateUserDto): Observable<AuthTokensDto> {
		return this._userService.findByEmail(user.email).pipe(
			exception(
				(candidate) => Boolean(candidate),
				new ConflictException(
					'Пользователь с таким email уже существует'
				)
			),
			switchMap(() => this._createUser(user)),
			tap(({ email, confirmationLink }) =>
				this._mailService.sendConfirmationMail(email, confirmationLink)
			),
			map((userEntity) => {
				const payload: JwtTokenPayload = {
					id: userEntity.id,
					email: userEntity.email,
					isConfirmed: userEntity.isConfirmed,
				};
				return {
					user: userEntity,
					tokens: this._tokenService.generateTokens(payload),
				};
			}),
			tap(({ user, tokens }) =>
				this._tokenService
					.saveRefreshToken(user.id, tokens.refreshToken)
					.subscribe()
			),
			map(({ tokens }) => tokens)
		);
	}

	private _comparePasswords(
		credentials: CredentialsDto,
		userEntity: UserEntity
	): Observable<UserEntity> {
		return from(
			bcrypt.compare(credentials.password, userEntity.password)
		).pipe(
			exception(
				(passwordEquals) => !passwordEquals,
				new UnauthorizedException({ message: 'Некоррекный пароль' })
			),
			map(() => userEntity)
		);
	}

	// TODO: to userService
	private _createUser(user: CreateUserDto): Observable<UserEntity> {
		return from(
			bcrypt.hash(user.password, Number(process.env.SALT_ROUNDS))
		).pipe(
			map(
				(hashedPassword) =>
					({
						...user,
						password: hashedPassword,
						confirmationLink: uuid.v4(),
					} as UserEntity)
			),
			switchMap((userWithHashedPassword) =>
				this._userService.create(userWithHashedPassword)
			)
		);
	}
}

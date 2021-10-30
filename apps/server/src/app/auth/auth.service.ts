import {
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { exception } from '@nx-mfe/rxjs';
import {
	AccessTokenDto,
	CreateUserDto,
	CredentialsDto,
	TokenPayload,
} from '@nx-mfe/shared/data-access';
import * as bcrypt from 'bcrypt';
import { from, map, Observable, switchMap } from 'rxjs';

import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly _jwtService: JwtService,
		private readonly _userService: UserService,
	) {}

	public login(credentials: CredentialsDto): Observable<AccessTokenDto> {
		return this._userService.findByEmail(credentials.email).pipe(
			exception(
				(userEntity) => !userEntity,
				new UnauthorizedException({ message: 'Некоррекный пароль' }),
			),
			switchMap((userEntity) =>
				this._comparePasswords(credentials, userEntity as UserEntity),
			),
			map((userEntity) => this._generateJwt(userEntity)),
		);
	}

	public register(user: CreateUserDto): Observable<AccessTokenDto> {
		return this._userService.findByEmail(user.email).pipe(
			exception(
				(candidate) => Boolean(candidate),
				new HttpException(
					'Пользователь с таким email уже существует',
					HttpStatus.CONFLICT,
				),
			),
			switchMap(() => this._createUser(user)),
			map((registeredUser) => this._generateJwt(registeredUser)),
		);
	}

	private _comparePasswords(
		credentials: CredentialsDto,
		userEntity: UserEntity,
	): Observable<UserEntity> {
		return from(
			bcrypt.compare(credentials.password, userEntity.password),
		).pipe(
			exception(
				(passwordEquals) => !passwordEquals,
				new UnauthorizedException({ message: 'Некоррекный пароль' }),
			),
			map(() => userEntity),
		);
	}

	private _createUser(user: CreateUserDto): Observable<UserEntity> {
		return from(
			bcrypt.hash(user.password, Number(process.env.SALT_ROUNDS)),
		).pipe(
			map((hashedPassword) => ({ ...user, password: hashedPassword })),
			switchMap((userWithHashedPassword) =>
				this._userService.create(userWithHashedPassword),
			),
		);
	}

	private _generateJwt(user: UserEntity): AccessTokenDto {
		const payload: TokenPayload = { id: user.id, email: user.email };
		const token = this._jwtService.sign(payload);
		const { exp } = this._jwtService.decode(token) as {
			[key: string]: any;
		};

		return { token, expiresIn: exp };
	}
}

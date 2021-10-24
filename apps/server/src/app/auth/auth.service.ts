import {
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
	AccessTokenDto,
	CreateUserDto,
	LoginUserDto,
	TokenPayload,
} from '@nx-mfe/shared/data-access';
import * as bcrypt from 'bcrypt';
import { from, map, Observable, switchMap, tap } from 'rxjs';

import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly _jwtService: JwtService,
		private readonly _userService: UserService,
	) {}

	public login(user: LoginUserDto): Observable<AccessTokenDto> {
		return this._userService.findOneByEmail(user.email).pipe(
			map((userEntity) => {
				if (!userEntity) {
					throw new UnauthorizedException({
						message: 'Пользователь не найден',
					});
				}

				return userEntity;
			}),
			switchMap((userEntity) =>
				from(bcrypt.compare(user.password, userEntity.password)).pipe(
					map((passwordEquals) => {
						if (!passwordEquals) {
							throw new UnauthorizedException({
								message: 'Некоррекный email или пароль',
							});
						}

						return userEntity;
					}),
				),
			),
			map((userEntity) => this._generateJwt(userEntity)),
		);
	}

	public register(user: CreateUserDto): Observable<AccessTokenDto> {
		return this._userService.findOneByEmail(user.email).pipe(
			map((candidate) => {
				if (candidate) {
					throw new HttpException(
						'Пользователь с таким email уже существует',
						HttpStatus.CONFLICT,
					);
				}

				return candidate;
			}),
			switchMap(() => this._createUser(user)),
			map((registeredUser) => this._generateJwt(registeredUser)),
		);
	}

	private _createUser(user: CreateUserDto): Observable<UserEntity> {
		return from(
			bcrypt.hash(user.password, Number(process.env.SALT_ROUNDS)),
		).pipe(
			tap(console.log),
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

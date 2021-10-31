import { Body, Controller, Post, Res } from '@nestjs/common';
import {
	AuthTokensDto,
	CreateUserDto,
	CredentialsDto,
} from '@nx-mfe/shared/data-access';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post('/login')
	public login(
		@Body() credentials: CredentialsDto
	): Observable<AuthTokensDto> {
		return this._authService.login(credentials);
	}

	// TODO remove (test)
	// @UseGuards(JwtAuthGuard)
	@Post('/register')
	public register(
		@Res({ passthrough: true }) response: Response,
		@Body() user: CreateUserDto
	): Observable<AuthTokensDto> {
		return this._authService.register(user).pipe(
			tap((tokens) =>
				response.cookie('refreshToken', tokens.refreshToken, {
					maxAge: 14 * 24 * 60 * 60 * 1000,
					httpOnly: true,
				})
			)
		);
	}
}

import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthTokensDto, CredentialsDto, RegistrationUserDto } from '@nx-mfe/shared/data-access';
import { Response } from 'express';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post('/login')
	public login(@Body() credentials: CredentialsDto): Promise<AuthTokensDto> {
		return this._authService.login(credentials);
	}

	// TODO remove (test)
	// @UseGuards(JwtAuthGuard)
	@Post('/register')
	public async register(
		@Res({ passthrough: true }) response: Response,
		@Body() registrationUserData: RegistrationUserDto
	): Promise<AuthTokensDto> {
		const tokens = await this._authService.register(registrationUserData);
		response.cookie('refreshToken', tokens.refreshToken, { maxAge: 14 * 24 * 60 * 60 * 1000, httpOnly: true });

		return tokens;
	}
}

import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AuthTokensDto, CredentialsDto, RegistrationUserDto } from '@nx-mfe/shared/data-access';
import { Response } from 'express';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post('/login')
	public async login(
		@Res({ passthrough: true }) response: Response,
		@Body() credentials: CredentialsDto
	): Promise<AuthTokensDto> {
		const tokens = await this._authService.login(credentials);
		response.cookie('refreshToken', tokens.refreshToken, {
			maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN),
			httpOnly: true,
		});

		return tokens;
	}

	// TODO remove (test)
	// @UseGuards(JwtAuthGuard)
	@Post('/register')
	public async register(@Body() registrationUserData: RegistrationUserDto): Promise<void> {
		return await this._authService.register(registrationUserData);
	}

	@Get('/register/confirmation/:link')
	public async registerConfirm(@Param('link') link: string, @Res() res: Response): Promise<void> {
		await this._authService.confirmRegistration(link);

		return res.redirect(String(process.env.CLIENT_URL));
	}
}

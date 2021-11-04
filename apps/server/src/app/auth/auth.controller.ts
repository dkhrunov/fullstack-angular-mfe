import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthTokensDto, CredentialsDto, RegistrationCredentialsDto } from '@nx-mfe/shared/data-access';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

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

	@Post('/register')
	public async register(@Body() registrationUserData: RegistrationCredentialsDto): Promise<void> {
		return await this._authService.register(registrationUserData);
	}

	@Get('/register/confirmation/:link')
	public async registerConfirm(@Param('link') link: string, @Res() res: Response): Promise<void> {
		await this._authService.confirmRegistration(link);

		return res.redirect(String(process.env.CLIENT_URL));
	}

	@Post('/logout')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	public async logout(@Req() request: Request, @Res() response: Response): Promise<void> {
		await this._authService.logout(request.cookies.refreshToken);

		response.clearCookie('refreshToken');
		response.send();
	}
}

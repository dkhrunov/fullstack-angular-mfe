import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthTokensDto, CredentialsDto, RegistrationCredentialsDto } from '@nx-mfe/shared/data-access';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post('/login')
	public async login(@Res({ passthrough: true }) res: Response, @Body() credentials: CredentialsDto): Promise<AuthTokensDto> {
		const tokens = await this._authService.login(credentials);
		this._setRefreshTokenInCookie(res, tokens.refreshToken);

		return tokens;
	}

	@Post('/register')
	public async register(@Body() registrationUserData: RegistrationCredentialsDto): Promise<void> {
		return await this._authService.register(registrationUserData);
	}

	@Get('/register/confirmation/:link')
	public async confirmRegistration(@Param('link') link: string, @Res() res: Response): Promise<void> {
		await this._authService.confirmRegistration(link);

		return res.redirect(String(process.env.CLIENT_URL));
	}

	@Post('/logout')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	public async logout(@Req() req: Request, @Res() res: Response): Promise<Response> {
		await this._authService.logout(req.cookies.refreshToken);
		res.clearCookie('refreshToken');

		return res.send();
	}

	@Get('/refresh')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	public async refresh(@Req() req: Request, @Res() res: Response): Promise<Response<AuthTokensDto>> {
		const tokens = await this._authService.refresh(req.cookies.refreshToken);
		this._setRefreshTokenInCookie(res, tokens.refreshToken);

		return res.json(tokens);
	}

	private _setRefreshTokenInCookie(res: Response, refreshToken: string): void {
		res.cookie('refreshToken', refreshToken, {
			maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN),
			httpOnly: true,
		});
	}
}

import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Req,
	Res,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthTokensDto, LoginDto, RegistrationDto } from '@nx-mfe/shared/data-access';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post('/login')
	public async login(
		@Res({ passthrough: true }) res: Response,
		@Body() body: LoginDto
	): Promise<AuthTokensDto> {
		const { session, ...credentials } = body;
		const tokens = await this._authService.login(credentials);
		this._setRefreshTokenInCookie(res, tokens.refreshToken, session);

		return tokens;
	}

	@Post('/register')
	public async register(@Body() credentials: RegistrationDto): Promise<void> {
		return await this._authService.register(credentials);
	}

	@Get('/register/confirmation/:link')
	public async confirmRegistration(
		@Param('link') link: string,
		@Res() res: Response
	): Promise<void> {
		await this._authService.confirmRegistration(link);

		return res.redirect(String(process.env.CLIENT_URL));
	}

	@Post('/logout')
	@HttpCode(200)
	public async logout(@Req() req: Request, @Res() res: Response): Promise<Response> {
		const refreshToken: string | undefined = req.cookies.refreshToken;

		if (!refreshToken) {
			throw new UnauthorizedException();
		}

		await this._authService.logout(refreshToken);
		res.clearCookie('refreshToken');

		return res.send();
	}

	@Post('/refresh')
	@HttpCode(200)
	public async refresh(
		@Req() req: Request,
		@Res() res: Response
	): Promise<Response<AuthTokensDto>> {
		const tokens = await this._authService.refresh(req.cookies.refreshToken);
		this._setRefreshTokenInCookie(res, tokens.refreshToken, req.cookies.session);

		return res.json(tokens);
	}

	private _setRefreshTokenInCookie(res: Response, refreshToken: string, session = false): void {
		if (session) {
			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
			});
		} else {
			res.cookie('refreshToken', refreshToken, {
				maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN) * 1000,
				httpOnly: true,
				path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
			});
		}

		// Set flag that keep info about type of authorization
		// If true when user select "Do not remember me"
		res.cookie('session', session, {
			maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN) * 1000,
			httpOnly: true,
			path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
		});
	}
}

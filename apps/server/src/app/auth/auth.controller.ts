import {
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	Ip,
	Param,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@nx-mfe/server/auth';
import { AuthTokensDto, LoginDto, RegistrationDto } from '@nx-mfe/shared/data-access';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post('/login')
	public async login(
		@Ip() ip: string,
		@Headers('User-Agent') userAgent: string,
		@Body() body: LoginDto,
		@Res({ passthrough: true }) res: Response
	): Promise<AuthTokensDto> {
		const { session, ...credentials } = body;

		const tokens = await this._authService.login(credentials, userAgent, ip);
		this._setRefreshTokenInCookie(res, tokens.refreshToken, session);

		return tokens;
	}

	@Post('/register')
	public async register(@Body() credentials: RegistrationDto): Promise<void> {
		return await this._authService.register(credentials);
	}

	@Get('/register/confirm/:link')
	public async confirmRegistration(
		@Param('link') link: string,
		@Res() res: Response
	): Promise<void> {
		await this._authService.confirmRegistration(link);

		return res.redirect(String(process.env.CLIENT_URL));
	}

	@UseGuards(JwtAuthGuard)
	@Post('/logout')
	@HttpCode(200)
	public async logout(@Req() req: Request, @Res() res: Response): Promise<Response> {
		const refreshToken: string | undefined = req.cookies.refreshToken;

		if (!refreshToken) {
			throw new UnauthorizedException();
		}

		await this._authService.logout(refreshToken);
		this._clearCookies(res);

		return res.send();
	}

	@Post('/refresh')
	@HttpCode(200)
	public async refresh(
		@Ip() ip: string,
		@Headers('User-Agent') userAgent: string,
		@Req() req: Request,
		@Res() res: Response
	): Promise<Response<AuthTokensDto>> {
		const tokens = await this._authService.refresh(req.cookies.refreshToken, userAgent, ip);
		this._setRefreshTokenInCookie(res, tokens.refreshToken, req.cookies.session);

		return res.json(tokens);
	}

	private _clearCookies(res: Response): void {
		res.clearCookie('refreshToken', {
			domain: process.env.DOMAIN,
			path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
		});

		res.clearCookie('session', {
			domain: process.env.DOMAIN,
			path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
		});
	}

	private _setRefreshTokenInCookie(res: Response, refreshToken: string, session = false): void {
		if (session) {
			res.cookie('refreshToken', refreshToken, {
				domain: process.env.DOMAIN,
				path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
				httpOnly: true,
			});
		} else {
			res.cookie('refreshToken', refreshToken, {
				domain: process.env.DOMAIN,
				path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
				maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN) * 1000,
				httpOnly: true,
			});
		}

		// Set flag that keep info about type of authorization
		// If true when user select "Do not remember me"
		res.cookie('session', session, {
			domain: process.env.DOMAIN,
			path: `/${process.env.GLOBAL_PREFIX || 'api'}/auth`,
			maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN) * 1000,
			httpOnly: true,
		});
	}
}

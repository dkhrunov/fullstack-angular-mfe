import { Body, Controller, Post } from '@nestjs/common';
import { AccessTokenDto, LoginUserDto } from '@nx-mfe/shared/data-access';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post('/login')
	public login(
		@Body() credentials: LoginUserDto,
	): Observable<AccessTokenDto> {
		return this._authService.login(credentials);
	}

	@Post('/register')
	public register(
		@Body() credentials: LoginUserDto,
	): Observable<AccessTokenDto> {
		return this._authService.register(credentials);
	}
}

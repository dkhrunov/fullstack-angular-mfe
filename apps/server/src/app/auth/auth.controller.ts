import { Body, Controller, Post } from '@nestjs/common';
import {
	AccessTokenDto,
	CreateUserDto,
	CredentialsDto,
} from '@nx-mfe/shared/data-access';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post('/login')
	public login(
		@Body() credentials: CredentialsDto,
	): Observable<AccessTokenDto> {
		return this._authService.login(credentials);
	}

	// TODO remove (test)
	// @UseGuards(JwtAuthGuard)
	@Post('/register')
	public register(@Body() user: CreateUserDto): Observable<AccessTokenDto> {
		return this._authService.register(user);
	}
}

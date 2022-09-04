import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
	InMemoryTokenStorage,
	JwtAuthInterceptor,
	JwtAuthModule,
	LocalStorageTokenStorage,
} from '@dekh/ngx-jwt-auth';

import { AuthApiService } from './services';

@NgModule({
	imports: [
		HttpClientModule,
		JwtAuthModule.forRoot({
			authApiService: AuthApiService,
			tokenStorage: LocalStorageTokenStorage,
			authTokenStorage: InMemoryTokenStorage,
			unsecuredUrls: ['/auth/login', '/auth/register', '/registration', '/auth/refresh'],
			unAuthGuardRedirectUrl: '/',
			authGuardRedirectUrl: '/auth/login',
			redirectToLastPage: true,
		}),
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JwtAuthInterceptor,
			multi: true,
		},
	],
})
export class AuthModule {}

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
			authHttpService: AuthApiService,
			tokenStorage: LocalStorageTokenStorage,
			authTokenStorage: InMemoryTokenStorage,
			unsecuredUrls: ['/auth/login', '/auth/register', '/auth/refresh'],
			unAuthGuardRedirectUrl: '/',
			authGuardRedirectUrl: '/auth/login',
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

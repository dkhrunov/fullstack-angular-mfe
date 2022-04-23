import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TokenManagerModule } from '@nx-mfe/client/token-manager';
import { AuthInterceptor } from './interceptors';

@NgModule({
	imports: [
		HttpClientModule,
		TokenManagerModule.forRoot({
			expireInField: 'exp',
		}),
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
	],
})
export class AuthModule {}

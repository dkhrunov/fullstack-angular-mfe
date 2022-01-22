import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TokenManagerModule } from '@nx-mfe/client/token-manager';

import { AuthInterceptor } from './interceptors';

@NgModule({
	imports: [HttpClientModule, TokenManagerModule.forRoot()],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
	],
})
export class AuthModule {}

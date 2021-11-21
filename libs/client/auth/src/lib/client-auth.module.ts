import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
	ClientTokenManagerModule,
	ETokenStorageType,
} from '@nx-mfe/client/token-manager';

import { AuthInterceptor } from './interceptors';

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		ClientTokenManagerModule.forRoot(ETokenStorageType.Cookies),
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
	],
})
export class ClientAuthModule {}

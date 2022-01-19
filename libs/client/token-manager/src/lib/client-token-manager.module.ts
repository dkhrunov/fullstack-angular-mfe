import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DEFAULT_TOKEN_STORAGE_TOKEN } from './injection-tokens';
import { TokenCookiesStorage } from './token-storage';

@NgModule({
	imports: [CommonModule],
	providers: [{ provide: DEFAULT_TOKEN_STORAGE_TOKEN, useValue: new TokenCookiesStorage() }],
})
export class ClientTokenManagerModule {}

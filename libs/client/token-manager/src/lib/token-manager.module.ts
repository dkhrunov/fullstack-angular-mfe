import { Injector, ModuleWithProviders, NgModule } from '@angular/core';

import {
	DEFAULT_AUTH_TOKEN_STORAGE,
	DEFAULT_TOKEN_STORAGE,
	TOKEN_MANAGER_OPTIONS,
} from './injection-tokens';
import { TokenManagerOptions } from './interfaces';
import { InMemoryTokenStorage, LocalStorageTokenStorage } from './token-storages';

@NgModule({})
export class TokenManagerModule {
	public static injector: Injector;

	constructor(injector: Injector) {
		TokenManagerModule.injector = injector;
	}

	public static forRoot(options: TokenManagerOptions): ModuleWithProviders<TokenManagerModule> {
		return {
			ngModule: TokenManagerModule,
			providers: [
				{
					provide: TOKEN_MANAGER_OPTIONS,
					useValue: options,
				},
				{
					provide: DEFAULT_TOKEN_STORAGE,
					useClass: options.defaultTokenStorage ?? LocalStorageTokenStorage,
				},
				{
					provide: DEFAULT_AUTH_TOKEN_STORAGE,
					useClass: options.defaultAuthTokenStorage ?? InMemoryTokenStorage,
				},
			],
		};
	}
}

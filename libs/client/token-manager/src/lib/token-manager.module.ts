import { ModuleWithProviders, NgModule } from '@angular/core';

import {
	AUTH_TOKEN_STORAGE_STRATEGY,
	DEFAULT_AUTH_TOKEN_STORAGE,
	DEFAULT_TOKEN_STORAGE,
	TOKEN_STORAGE_STRATEGY,
} from './injection-tokens';
import { ITokenManagerConfig } from './interfaces';
import { AuthTokenStorageStrategy, TokenStorageStrategy } from './services';
import { TokenLocalStorage } from './token-storage';

@NgModule({})
export class TokenManagerModule {
	/**
	 * Используется для настройки стандартных хранилищ токенов и токенов авторизации
	 * @param config Кастомная конфигурация
	 */
	public static forRoot(config?: ITokenManagerConfig): ModuleWithProviders<TokenManagerModule> {
		return {
			ngModule: TokenManagerModule,
			providers: [
				{
					provide: DEFAULT_TOKEN_STORAGE,
					useClass: config?.defaultTokenStorage ?? TokenLocalStorage,
				},
				{
					provide: DEFAULT_AUTH_TOKEN_STORAGE,
					useClass: config?.defaultAuthTokenStorage ?? TokenLocalStorage,
				},
				{
					provide: TOKEN_STORAGE_STRATEGY,
					useExisting: TokenStorageStrategy,
				},
				{
					provide: AUTH_TOKEN_STORAGE_STRATEGY,
					useExisting: AuthTokenStorageStrategy,
				},
			],
		};
	}
}

import { ModuleWithProviders, NgModule } from '@angular/core';

import {
	AUTH_TOKEN_STORAGE_STRATEGY_TOKEN,
	DEFAULT_AUTH_TOKEN_STORAGE_TOKEN,
	DEFAULT_TOKEN_STORAGE_TOKEN,
	TOKEN_STORAGE_STRATEGY_TOKEN,
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
					provide: DEFAULT_TOKEN_STORAGE_TOKEN,
					useClass: config?.defaultTokenStorage ?? TokenLocalStorage,
				},
				{
					provide: DEFAULT_AUTH_TOKEN_STORAGE_TOKEN,
					useClass: config?.defaultAuthTokenStorage ?? TokenLocalStorage,
				},
				{
					provide: TOKEN_STORAGE_STRATEGY_TOKEN,
					useExisting: TokenStorageStrategy,
				},
				{
					provide: AUTH_TOKEN_STORAGE_STRATEGY_TOKEN,
					useExisting: AuthTokenStorageStrategy,
				},
			],
		};
	}
}

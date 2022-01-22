import { Type } from '@angular/core';

import { TokenStorage } from '../token-storage';

export interface ITokenManagerConfig {
	/**
	 * Стандартное хранилище токенов
	 */
	defaultTokenStorage?: Type<TokenStorage>;
	/**
	 * Стандартное хранилище токенов авторизации
	 */
	defaultAuthTokenStorage?: Type<TokenStorage>;
}

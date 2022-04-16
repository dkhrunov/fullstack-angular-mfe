import { Type } from '@angular/core';
import { TokenStorage } from '../token-storages';

export interface ITokenManagerConfig {
	/**
	 * Стандартное хранилище токенов
	 */
	defaultTokenStorage?: Type<TokenStorage>;
	/**
	 * Стандартное хранилище токенов авторизации
	 */
	defaultAuthTokenStorage?: Type<TokenStorage>;
	/**
	 * Массив кастомных (пользовательских) хранилищ токена
	 */
	customTokenStorages?: TokenStorage[];
}

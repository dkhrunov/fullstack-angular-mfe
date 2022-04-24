import { Type } from '@angular/core';
import { BaseTokenStorage } from '../token-storages';

export interface TokenManagerOptions {
	/**
	 * Поле в payload токена, отвечающее за время валидности токена
	 */
	expireInField: string;
	/**
	 * Стандартное хранилище токенов
	 */
	defaultTokenStorage?: Type<BaseTokenStorage>;
	/**
	 * Стандартное хранилище токенов авторизации
	 */
	defaultAuthTokenStorage?: Type<BaseTokenStorage>;
	/**
	 * Массив кастомных (пользовательских) хранилищ токена
	 */
	customTokenStorages?: BaseTokenStorage[];
}

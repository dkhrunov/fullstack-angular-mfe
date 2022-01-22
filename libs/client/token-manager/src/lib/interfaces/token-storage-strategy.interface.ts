import { ETokenStorageType } from '../enums';
import { TokenStorage } from '../token-storage';

export interface ITokenStorageStrategy {
	/**
	 * Получить стратегию хранения токена авторизации
	 */
	get strategy(): TokenStorage;
	/**
	 * Устанавливает стратегию хранения токена авторизации
	 * @param type Хранилище токена
	 */
	setStrategy(type: ETokenStorageType): void;
}

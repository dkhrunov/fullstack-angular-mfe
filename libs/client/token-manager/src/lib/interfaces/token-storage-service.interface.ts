import { TokenStorage } from '../token-storage';

export interface ITokenStorageService {
	/**
	 * Получить стратегию хранения токена авторизации
	 */
	get storage(): TokenStorage;
	/**
	 * Устанавливает стратегию хранения токена авторизации
	 * @param type Хранилище токена
	 */
	setStorage(type: TokenStorage): void;
}

import { ETokenStorageType } from '../enums';
import { TokenStorage } from '../token-storage';

export interface ITokenStorageManager {
	/**
	 * Получить актуальное хранилище токена
	 */
	get tokenStorage(): TokenStorage;
	/**
	 * Устанавливает хранилище токена
	 * @param type Хранилище токена
	 */
	setTokenStorage(type: ETokenStorageType): void;
}

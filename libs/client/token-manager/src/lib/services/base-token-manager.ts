import { BaseTokenStorage } from '../token-storages';
import { BaseTokenStorageManager } from './base-token-storage-manager';

export abstract class BaseTokenManager {
	protected get _tokenStorage(): BaseTokenStorage {
		return this._tokenStorageService.storage;
	}

	constructor(protected readonly _tokenStorageService: BaseTokenStorageManager) {}

	/**
	 * Получить токен по имени.
	 * @param tokenName Имя токена.
	 */
	public get(tokenName: string): string | null {
		return this._tokenStorage.get(tokenName);
	}

	/**
	 * Сохранить токен, где имя токена является его ключом.
	 * @param tokenName Имя токена.
	 * @param token Токен.
	 */
	public set(tokenName: string, token: string): void {
		this._tokenStorage.set(tokenName, token);
	}

	/**
	 * Удалить токен по имени.
	 * @param tokenName Имя токена.
	 */
	public delete(tokenName: string): void {
		this._tokenStorage.delete(tokenName);
	}

	/**
	 * Проверка валидности токена.
	 * @param tokenName Имя токена.
	 */
	public isValid(tokenName: string): boolean {
		return this._tokenStorage.isValid(tokenName);
	}
}

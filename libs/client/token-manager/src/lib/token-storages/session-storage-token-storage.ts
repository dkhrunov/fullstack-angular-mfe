import { BaseTokenStorage } from './base-token-storage';

export class SessionStorageTokenStorage extends BaseTokenStorage {
	/**
	 * Получить токен из `sessionStorage`.
	 * @param key Ключ, по которому будут храниться токен.
	 */
	public get(key: string): string | null {
		return sessionStorage.getItem(key);
	}

	/**
	 * Сохранить токен в `sessionStorage`.
	 * @param key Ключ, по которому будут храниться токен.
	 * @param token Токен.
	 */
	public set(key: string, token: string): void {
		sessionStorage.setItem(key, token);
	}

	/**
	 * Удалить токен из `sessionStorage`.
	 * @param key Ключ, по которому будут храниться токен.
	 */
	public delete(key: string): void {
		sessionStorage.removeItem(key);
	}
}

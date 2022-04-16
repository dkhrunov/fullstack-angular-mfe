import { TokenStorage } from './token-storage';

export class TokenLocalStorage extends TokenStorage {
	/**
	 * Получить токен из `localStorage`.
	 * @param key Ключ, по которому будут храниться токен.
	 */
	public get(key: string): string | null {
		return localStorage.getItem(key);
	}

	/**
	 * Сохранить токен в `localStorage`.
	 * @param key Ключ, по которому будут храниться токен.
	 * @param token Токен.
	 */
	public set(key: string, token: string): void {
		localStorage.setItem(key, token);
	}

	/**
	 * Удалить токен из `localStorage`.
	 * @param key Ключ, по которому будут храниться токен.
	 */
	public delete(key: string): void {
		localStorage.removeItem(key);
	}
}

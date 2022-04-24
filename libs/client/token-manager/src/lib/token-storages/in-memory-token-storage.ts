import { BaseTokenStorage } from './base-token-storage';

export class InMemoryTokenStorage extends BaseTokenStorage {
	private readonly _storage = new Map<string, string>();

	/**
	 * Получить токен из memory.
	 * @param key Ключ, по которому будут храниться токен.
	 */
	public get(key: string): string | null {
		return this._storage.get(key) ?? null;
	}

	/**
	 * Сохранить токен в  memory.
	 * @param key Ключ, по которому будут храниться токен.
	 * @param token Токен.
	 */
	public set(key: string, token: string): void {
		this._storage.set(key, token);
	}

	/**
	 * Удалить токен из  memory.
	 * @param key Ключ, по которому будут храниться токен.
	 */
	public delete(key: string): void {
		this._storage.delete(key);
	}
}

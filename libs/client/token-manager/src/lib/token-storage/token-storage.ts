import { JwtDecoder } from '../helpers';

export abstract class TokenStorage {
	/**
	 * Получить токен из хранилища.
	 * @param key Ключ под которым храниться токен.
	 */
	public abstract get(key: string): string | null;

	/**
	 * Сохраняет токен в хранилище.
	 * @param key Ключ под которым будет храниться токен.
	 * @param token Токен.
	 */
	public abstract set(key: string, token: string): void;

	/**
	 * Удаляет токен из хранилища.
	 * @param key Ключ под которым храниться токен.
	 */
	public abstract delete(key: string): void;

	/**
	 * Проверить валидность токена.
	 * @param key Ключ, по которому токен.
	 */
	public isValid(key: string): boolean {
		const token = this.get(key);

		if (!token) {
			return false;
		}

		const expireIn = JwtDecoder.decode(token).exp;

		const isInfiniteToken = expireIn === -1;
		if (isInfiniteToken) {
			return true;
		}

		return expireIn > Math.floor(Date.now() / 1000);
	}
}

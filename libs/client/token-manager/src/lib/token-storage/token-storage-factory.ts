import { ETokenStorageType } from '../enums';
import { TokenCookiesStorage } from './token-cookies-storage';
import { TokenLocalStorage } from './token-local-storage';
import { TokenSessionStorage } from './token-session-storage';
import { TokenStorage } from './token-storage';

export class TokenStorageFactory {
	public static create(type: ETokenStorageType): TokenStorage {
		switch (type) {
			case ETokenStorageType.Cookies:
				return new TokenCookiesStorage();
			case ETokenStorageType.LocalStorage:
				return new TokenLocalStorage();
			case ETokenStorageType.SessionStorage:
				return new TokenSessionStorage();
			default:
				throw new Error(
					`Error: this storage strategy type - ${type} not supported`
				);
		}
	}
}

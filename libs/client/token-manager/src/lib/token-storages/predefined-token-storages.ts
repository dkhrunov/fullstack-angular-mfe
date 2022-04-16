import { TokenCookiesStorage } from './token-cookies-storage';
import { TokenLocalStorage } from './token-local-storage';
import { TokenSessionStorage } from './token-session-storage';
import { TokenStorage } from './token-storage';

export const PREDEFINED_TOKEN_STORAGES: TokenStorage[] = [
	new TokenCookiesStorage(),
	new TokenLocalStorage(),
	new TokenSessionStorage(),
];

import { CookiesTokenStorage } from './cookies-token-storage';
import { InMemoryTokenStorage } from './in-memory-token-storage';
import { LocalStorageTokenStorage } from './local-storage-token-storage';
import { SessionStorageTokenStorage } from './session-storage-token-storage';

export const PREDEFINED_TOKEN_STORAGES = [
	new CookiesTokenStorage(),
	new LocalStorageTokenStorage(),
	new SessionStorageTokenStorage(),
	new InMemoryTokenStorage(),
];

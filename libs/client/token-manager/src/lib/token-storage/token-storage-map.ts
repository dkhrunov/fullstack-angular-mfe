import { Type } from '@angular/core';
import { TokenCookiesStorage, TokenLocalStorage, TokenSessionStorage, TokenStorage } from '.';

export const tokenStorageMap = new Map<string, Type<TokenStorage>>([
	[TokenLocalStorage.name, TokenLocalStorage],
	[TokenSessionStorage.name, TokenSessionStorage],
	[TokenCookiesStorage.name, TokenCookiesStorage],
]);

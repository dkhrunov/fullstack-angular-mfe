import { Type } from '@angular/core';
import { TokenCookiesStorage, TokenLocalStorage, TokenSessionStorage, TokenStorage } from '.';
import { ETokenStorage } from '../enums';

export const tokenStorageMap = new Map<ETokenStorage, Type<TokenStorage>>([
	[ETokenStorage.LocalStorage, TokenLocalStorage],
	[ETokenStorage.SessionStorage, TokenSessionStorage],
	[ETokenStorage.Cookies, TokenCookiesStorage],
]);

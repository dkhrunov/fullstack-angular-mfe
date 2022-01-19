import { Type } from '@angular/core';

import { ETokenStorageType } from '../enums';
import { TokenCookiesStorage, TokenLocalStorage, TokenSessionStorage, TokenStorage } from '.';

export const tokenStorageMap = new Map<ETokenStorageType, Type<TokenStorage>>([
	[ETokenStorageType.LocalStorage, TokenLocalStorage],
	[ETokenStorageType.SessionStorage, TokenSessionStorage],
	[ETokenStorageType.Cookies, TokenCookiesStorage],
]);

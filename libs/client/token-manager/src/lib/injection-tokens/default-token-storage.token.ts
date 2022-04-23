import { InjectionToken } from '@angular/core';
import { BaseTokenStorage } from '../token-storages';

export const DEFAULT_TOKEN_STORAGE = new InjectionToken<BaseTokenStorage>(
	'@nx-mfe/client/token-manager/DEFAULT_TOKEN_STORAGE'
);

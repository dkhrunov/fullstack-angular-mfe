import { InjectionToken } from '@angular/core';
import { TokenManagerOptions } from '../interfaces';

export const TOKEN_MANAGER_OPTIONS = new InjectionToken<TokenManagerOptions>(
	'@nx-mfe/client/token-manager/TOKEN_MANAGER_OPTIONS'
);

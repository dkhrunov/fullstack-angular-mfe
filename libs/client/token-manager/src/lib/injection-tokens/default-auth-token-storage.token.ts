import { InjectionToken } from '@angular/core';

export const DEFAULT_AUTH_TOKEN_STORAGE = new InjectionToken<string>(
	'@nx-mfe/client/token-manager/DEFAULT_AUTH_TOKEN_STORAGE'
);

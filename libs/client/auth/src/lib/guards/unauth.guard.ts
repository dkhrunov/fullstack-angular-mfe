import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services';

@Injectable({
	providedIn: 'root',
})
export class UnauthGuard implements CanLoad, CanActivate {
	constructor(private readonly _router: Router, private readonly _authService: AuthService) {}

	public canLoad(): boolean | UrlTree {
		return this._guarantee();
	}

	public canActivate(): boolean | UrlTree {
		return this._guarantee();
	}

	private _guarantee(): boolean | UrlTree {
		if (!this._authService.isLoggedIn) {
			return true;
		}

		return this._router.createUrlTree(['/']);
	}
}

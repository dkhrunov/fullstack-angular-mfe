import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';

import { AuthService } from '../services';

@Injectable({
	providedIn: 'root',
})
export class UnAuthGuard implements CanLoad, CanActivate {
	constructor(private readonly _router: Router, private readonly _authService: AuthService) {}

	public canLoad(): Observable<true | UrlTree> {
		return this._guarantee();
	}

	public canActivate(): Observable<true | UrlTree> {
		return this._guarantee();
	}

	private _guarantee(): Observable<true | UrlTree> {
		return this._authService.isLoggedIn$.pipe(
			take(1),
			map((x) => (x ? this._router.createUrlTree(['/']) : true))
		);
	}
}

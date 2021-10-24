import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { UserService } from '@nx-mfe/shared/data-access-user';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AuthorizedGuard implements CanLoad {
	constructor(
		private readonly _router: Router,
		private readonly _userService: UserService,
	) {}

	public canLoad(): Observable<boolean> {
		return this._guarantee();
	}

	private _guarantee(): Observable<boolean> {
		return this._userService.isUserLoggedIn$.pipe(
			tap((x) => !x && this._router.navigate(['/login'])),
		);
	}
}

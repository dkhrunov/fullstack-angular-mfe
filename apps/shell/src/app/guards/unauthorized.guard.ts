import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@nx-mfe/shared/data-access-user';
import { map, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class UnauthorizedGuard implements CanActivate {
	constructor(
		private readonly _router: Router,
		private readonly _userService: UserService
	) {
	}

	public canActivate(): Observable<boolean> {
		return this._userService.isUserLoggedIn$.pipe(
			tap((x) => x && this._router.navigate(['/'])),
			map((x) => !x)
		);
	}
}

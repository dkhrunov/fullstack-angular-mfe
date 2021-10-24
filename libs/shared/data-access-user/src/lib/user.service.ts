import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private readonly _isUserLoggedIn = new BehaviorSubject(
		JSON.parse(localStorage.getItem('auth') ?? 'false'),
	);

	public get isUserLoggedIn$(): Observable<boolean> {
		return this._isUserLoggedIn.asObservable();
	}

	constructor(private readonly _router: Router) {
		this._isUserLoggedIn.subscribe((x) =>
			localStorage.setItem('auth', JSON.stringify(x)),
		);
	}

	public login(username: string, password: string) {
		if (username === 'demo' && password === 'demo') {
			this._isUserLoggedIn.next(true);
			this._router.navigate(['/']);
		}
	}

	public logout() {
		this._isUserLoggedIn.next(false);
	}
}

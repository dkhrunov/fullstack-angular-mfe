import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	public get isUserLoggedIn$(): Observable<boolean> {
		return this._isUserLoggedIn.asObservable();
	}

	private readonly _isUserLoggedIn = new BehaviorSubject(false);

	public checkCredentials(username: string, password: string) {
		if (username === 'demo' && password === 'demo') {
			this._isUserLoggedIn.next(true);
		}
	}

	public logout() {
		this._isUserLoggedIn.next(false);
	}
}

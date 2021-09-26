import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { UserService } from '@nx-mfe/shared/data-access-user';
import { Router } from '@angular/router';

@Component({
	selector: 'nx-mfe-root',
	template: `
		<h2>{{ title }}d</h2>

		<div class="content" *ngIf="isLoggedIn$ | async; else signIn">
			You are authenticated so you can see this content.
		</div>

		<ng-template #signIn>
			<router-outlet></router-outlet>
		</ng-template>
	`,
	styles: [],
})
export class AppComponent implements OnInit {
	public readonly title = 'Admin Dashboard';
	public readonly isLoggedIn$ = this._userService.isUserLoggedIn$;

	constructor(
		private readonly _userService: UserService,
		private readonly _router: Router
	) {
	}

	ngOnInit() {
		this.isLoggedIn$
			.pipe(
				distinctUntilChanged(),
				map((loggedIn) => (loggedIn ? '' : 'login')),
				tap((url) => this._router.navigateByUrl(url))
			)
			.subscribe();
	}
}

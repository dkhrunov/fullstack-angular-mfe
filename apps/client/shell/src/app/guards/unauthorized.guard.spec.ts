import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserService } from '@nx-mfe/shared/data-access-user';
import { of } from 'rxjs';

import { UnauthorizedGuard } from './unauthorized.guard';

describe(UnauthorizedGuard, () => {
	let guard: UnauthorizedGuard;
	let userService: UserService;
	let router: Router;
	const routerMock = { navigate: jest.fn() };

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				UnauthorizedGuard,
				{ provide: Router, useValue: routerMock },
			],
			imports: [HttpClientTestingModule],
		});

		guard = TestBed.inject(UnauthorizedGuard);
		userService = TestBed.inject(UserService);
		router = TestBed.inject(Router);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	it('should redirect an authenticated user to the home page', (done) => {
		jest.spyOn(userService, 'isUserLoggedIn$', 'get').mockReturnValue(
			of(true),
		);

		guard.canLoad().subscribe((x) => {
			expect(x).toBeFalsy();
			expect(router.navigate).toHaveBeenCalledWith(['/']);
			done();
		});
	});

	it('should allow the unauthenticated user to access login page', (done) => {
		jest.spyOn(userService, 'isUserLoggedIn$', 'get').mockReturnValue(
			of(false),
		);

		guard.canLoad().subscribe((x) => {
			expect(x).toBeTruthy();
			done();
		});
	});
});

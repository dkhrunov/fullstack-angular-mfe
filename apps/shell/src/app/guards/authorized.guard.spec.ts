import { TestBed } from '@angular/core/testing';
import { AuthorizedGuard } from './authorized.guard';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '@nx-mfe/shared/data-access-user';
import { of } from 'rxjs';

describe(AuthorizedGuard, () => {
	let guard: AuthorizedGuard;
	let userService: UserService;
	let router: Router;
	const routerMock = { navigate: jest.fn() };

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				AuthorizedGuard,
				{ provide: Router, useValue: routerMock },
			],
			imports: [HttpClientTestingModule],
		}).compileComponents();

		guard = TestBed.inject(AuthorizedGuard);
		userService = TestBed.inject(UserService);
		router = TestBed.inject(Router);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	it('should redirect an authenticated user to the login page', (done) => {
		jest.spyOn(userService, 'isUserLoggedIn$', 'get').mockReturnValue(
			of(false)
		);

		guard.canActivate().subscribe((x) => {
			expect(x).toBeFalsy();
			expect(router.navigate).toHaveBeenCalledWith(['/login']);
			done();
		});
	});

	it('should allow the authenticated user to access app', (done) => {
		jest.spyOn(userService, 'isUserLoggedIn$', 'get').mockReturnValue(
			of(true)
		);

		guard.canActivate().subscribe((x) => {
			expect(x).toBeTruthy();
			done();
		});
	});
});

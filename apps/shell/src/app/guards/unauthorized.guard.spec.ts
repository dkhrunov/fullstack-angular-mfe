import { TestBed } from '@angular/core/testing';
import { UnauthorizedGuard } from './unauthorized.guard';
import { UserService } from '@nx-mfe/shared/data-access-user';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe(UnauthorizedGuard, () => {
	let guard: UnauthorizedGuard;
	let userService: UserService;
	let router: Router;
	const routerMock = { navigate: jest.fn() };

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [
				UnauthorizedGuard,
				{ provide: Router, useValue: routerMock },
			],
			imports: [HttpClientTestingModule],
		}).compileComponents();

		guard = TestBed.inject(UnauthorizedGuard);
		userService = TestBed.inject(UserService);
		router = TestBed.inject(Router);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	it('should redirect an authenticated user to the home page', (done) => {
		jest.spyOn(userService, 'isUserLoggedIn$', 'get').mockReturnValue(
			of(true)
		);

		guard.canActivate().subscribe((x) => {
			expect(x).toBeFalsy();
			expect(router.navigate).toHaveBeenCalledWith(['/']);
			done();
		});
	});

	it('should allow the unauthenticated user to access login page', (done) => {
		jest.spyOn(userService, 'isUserLoggedIn$', 'get').mockReturnValue(
			of(false)
		);

		guard.canActivate().subscribe((x) => {
			expect(x).toBeTruthy();
			done();
		});
	});
});

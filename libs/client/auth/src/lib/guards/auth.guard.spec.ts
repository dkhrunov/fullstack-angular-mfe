// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { UserService } from '@nx-mfe/shared/data-access-user';
// import { of } from 'rxjs';
//
// import { AuthorizedGuard } from './authorized.guard';
//
// describe(AuthGuard, () => {
// 	let guard: AuthorizedGuard;
// 	let userService: UserService;
// 	let router: Router;
// 	const routerMock = { navigate: jest.fn() };
//
// 	beforeEach(() => {
// 		TestBed.configureTestingModule({
// 			providers: [
// 				AuthorizedGuard,
// 				{ provide: Router, useValue: routerMock },
// 			],
// 			imports: [HttpClientTestingModule],
// 		});
//
// 		guard = TestBed.inject(AuthorizedGuard);
// 		userService = TestBed.inject(UserService);
// 		router = TestBed.inject(Router);
// 	});
//
// 	it('should be created', () => {
// 		expect(guard).toBeTruthy();
// 	});
//
// 	it('should redirect an authenticated user to the login page', (done) => {
// 		jest.spyOn(userService, 'isUserLoggedIn$', 'get').mockReturnValue(
// 			of(false),
// 		);
//
// 		guard.canLoad().subscribe((x) => {
// 			expect(x).toBeFalsy();
// 			expect(router.navigate).toHaveBeenCalledWith(['/login']);
// 			done();
// 		});
// 	});
//
// 	it('should allow the authenticated user to access app', (done) => {
// 		jest.spyOn(userService, 'isUserLoggedIn$', 'get').mockReturnValue(
// 			of(true),
// 		);
//
// 		guard.canLoad().subscribe((x) => {
// 			expect(x).toBeTruthy();
// 			done();
// 		});
// 	});
// });

import { TestBed } from '@angular/core/testing';

import { LoginFacadeService } from './login-facade.service';

describe('LoginFacadeService', () => {
	let service: LoginFacadeService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LoginFacadeService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

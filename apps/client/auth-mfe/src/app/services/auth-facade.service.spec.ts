import { TestBed } from '@angular/core/testing';

import { AuthFacadeService } from './auth-facade.service';

describe(AuthFacadeService, () => {
	let service: AuthFacadeService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(AuthFacadeService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

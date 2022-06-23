import { TestBed } from '@angular/core/testing';

import { RegisterFacadeService } from './register-facade.service';

describe('RegisterFacadeService', () => {
	let service: RegisterFacadeService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(RegisterFacadeService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

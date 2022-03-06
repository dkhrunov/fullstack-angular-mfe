import { TestBed } from '@angular/core/testing';

import { MfeService } from './mfe.service';

describe('MfeService', () => {
	let service: MfeService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(MfeService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

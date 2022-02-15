import { TestBed } from '@angular/core/testing';

import { MfeComponentsCacheService } from './mfe-components-cache.service';

describe('MfeComponentsCacheService', () => {
	let service: MfeComponentsCacheService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(MfeComponentsCacheService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

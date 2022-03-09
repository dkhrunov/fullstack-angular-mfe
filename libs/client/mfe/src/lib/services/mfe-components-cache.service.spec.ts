import { TestBed } from '@angular/core/testing';

import { MfeComponentsCache } from '.';

describe(MfeComponentsCache, () => {
	let service: MfeComponentsCache;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(MfeComponentsCache);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

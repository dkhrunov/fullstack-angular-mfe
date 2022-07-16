import { TestBed } from '@angular/core/testing';

import { RemoteComponentsCache } from '.';

describe(RemoteComponentsCache, () => {
	let service: RemoteComponentsCache;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(RemoteComponentsCache);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

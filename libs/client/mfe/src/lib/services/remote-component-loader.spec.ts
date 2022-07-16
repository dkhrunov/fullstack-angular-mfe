import { TestBed } from '@angular/core/testing';

import { RemoteComponentLoader } from './remote-component-loader';

describe(RemoteComponentLoader, () => {
	let service: RemoteComponentLoader;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(RemoteComponentLoader);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

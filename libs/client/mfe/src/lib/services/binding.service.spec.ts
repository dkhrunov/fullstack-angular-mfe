import { TestBed } from '@angular/core/testing';

import { DynamicComponentBinding } from './dynamic-component-binding';

describe(DynamicComponentBinding, () => {
	let service: DynamicComponentBinding;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DynamicComponentBinding);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

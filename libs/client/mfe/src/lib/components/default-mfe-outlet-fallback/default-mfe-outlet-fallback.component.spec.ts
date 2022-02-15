import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultMfeOutletFallbackComponent } from './';

describe(DefaultMfeOutletFallbackComponent, () => {
	let component: DefaultMfeOutletFallbackComponent;
	let fixture: ComponentFixture<DefaultMfeOutletFallbackComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DefaultMfeOutletFallbackComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DefaultMfeOutletFallbackComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

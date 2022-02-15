import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultMfeOutletLoaderComponent } from './';

describe(DefaultMfeOutletLoaderComponent, () => {
	let component: DefaultMfeOutletLoaderComponent;
	let fixture: ComponentFixture<DefaultMfeOutletLoaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DefaultMfeOutletLoaderComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DefaultMfeOutletLoaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

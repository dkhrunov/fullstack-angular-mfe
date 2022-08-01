import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRegistrationModalComponent } from './confirm-registration-modal.component';

describe('ConfirmRegistrationModalComponent', () => {
	let component: ConfirmRegistrationModalComponent;
	let fixture: ComponentFixture<ConfirmRegistrationModalComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ConfirmRegistrationModalComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmRegistrationModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

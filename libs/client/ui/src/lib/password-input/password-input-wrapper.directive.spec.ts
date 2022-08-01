import { PasswordInputWrapperDirective } from './password-input-wrapper.directive';

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
	selector: 'ui-password-input-wrapper',
	template: '<div uiPasswordInputWrapper><div>',
})
class TestPasswordInputWrapperComponent {}

describe(PasswordInputWrapperDirective, () => {
	let fixture: ComponentFixture<TestPasswordInputWrapperComponent>;
	let directiveEl: any;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TestPasswordInputWrapperComponent, PasswordInputWrapperDirective],
		}).compileComponents();

		fixture = TestBed.createComponent(TestPasswordInputWrapperComponent);
		fixture.detectChanges();

		directiveEl = fixture.debugElement.query(
			By.directive(PasswordInputWrapperDirective)
		).nativeElement;
	});

	it('should render a password-input-wrapper', () => {
		expect(directiveEl).not.toBeNull();
	});

	it('should has a base class', () => {
		expect(directiveEl.classList.contains('ui-password-input-wrapper')).toBeTruthy();
	});
});

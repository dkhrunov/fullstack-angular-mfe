import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CardHeaderDirective } from './card-header.directive';

@Component({
	selector: 'ui-test-card',
	template: '<ui-card-header></ui-card-header>',
})
class TestCardComponent {}

describe(CardHeaderDirective, () => {
	let fixture: ComponentFixture<TestCardComponent>;
	let directiveEl: any;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TestCardComponent, CardHeaderDirective],
		}).compileComponents();

		fixture = TestBed.createComponent(TestCardComponent);
		fixture.detectChanges();

		directiveEl = fixture.debugElement.query(By.directive(CardHeaderDirective)).nativeElement;
	});

	it('should render a card-header', () => {
		expect(directiveEl).not.toBeNull();
	});

	it('should has a correct class names', () => {
		expect(directiveEl.classList.contains('ui-card__header')).toBeTruthy();
	});
});

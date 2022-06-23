import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CardTitleDirective } from './card-title.directive';

@Component({
	selector: 'ui-test-card',
	template: '<ui-card-title></ui-card-title>',
})
class TestCardComponent {}

describe(CardTitleDirective, () => {
	let fixture: ComponentFixture<TestCardComponent>;
	let directiveEl: any;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TestCardComponent, CardTitleDirective],
		}).compileComponents();

		fixture = TestBed.createComponent(TestCardComponent);
		fixture.detectChanges();

		directiveEl = fixture.debugElement.query(By.directive(CardTitleDirective)).nativeElement;
	});

	it('should render a card-title', () => {
		expect(directiveEl).not.toBeNull();
	});

	it('should has a correct class names', () => {
		expect(directiveEl.classList.contains('ui-card__title')).toBeTruthy();
	});
});

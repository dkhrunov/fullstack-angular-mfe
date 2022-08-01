import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CardContentDirective } from './card-content.directive';

@Component({
	selector: 'ui-test-card',
	template: '<ui-card-content><ui-card-content>',
})
class TestCardComponent {}

describe(CardContentDirective, () => {
	let fixture: ComponentFixture<TestCardComponent>;
	let directiveEl: any;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TestCardComponent, CardContentDirective],
		}).compileComponents();

		fixture = TestBed.createComponent(TestCardComponent);
		fixture.detectChanges();

		directiveEl = fixture.debugElement.query(By.directive(CardContentDirective)).nativeElement;
	});

	it('should render a card-content', () => {
		expect(directiveEl).not.toBeNull();
	});

	it('should has a correct class names', () => {
		expect(directiveEl.classList.contains('ui-card__content')).toBeTruthy();
	});
});

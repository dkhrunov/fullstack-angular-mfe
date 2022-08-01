import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CardSubtitleDirective } from './card-subtitle.directive';

@Component({
	selector: 'ui-test-card',
	template: '<ui-card-subtitle></ui-card-subtitle>',
})
class TestCardComponent {}

describe(CardSubtitleDirective, () => {
	let fixture: ComponentFixture<TestCardComponent>;
	let directiveEl: any;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TestCardComponent, CardSubtitleDirective],
		}).compileComponents();

		fixture = TestBed.createComponent(TestCardComponent);
		fixture.detectChanges();

		directiveEl = fixture.debugElement.query(By.directive(CardSubtitleDirective)).nativeElement;
	});

	it('should render a card-subtitle', () => {
		expect(directiveEl).not.toBeNull();
	});

	it('should has a correct class names', () => {
		expect(directiveEl.classList.contains('ui-card__subtitle')).toBeTruthy();
	});
});

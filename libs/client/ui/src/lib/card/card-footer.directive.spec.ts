import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CardFooterDirective } from './card-footer.directive';

@Component({
	selector: 'ui-test-card',
	template: '<ui-card-footer></ui-card-footer>',
})
class TestCardComponent {}

describe(CardFooterDirective, () => {
	let fixture: ComponentFixture<TestCardComponent>;
	let directiveEl: any;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TestCardComponent, CardFooterDirective],
		}).compileComponents();

		fixture = TestBed.createComponent(TestCardComponent);
		fixture.detectChanges();

		directiveEl = fixture.debugElement.query(By.directive(CardFooterDirective)).nativeElement;
	});

	it('should render a card-footer', () => {
		expect(directiveEl).not.toBeNull();
	});

	it('should has a correct class names', () => {
		expect(directiveEl.classList.contains('ui-card__footer')).toBeTruthy();
	});
});

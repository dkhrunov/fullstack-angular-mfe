import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerComponent } from './divider.component';

describe(DividerComponent, () => {
	let dividerComponent: DividerComponent;
	let fixture: ComponentFixture<DividerComponent>;
	let dividerDebugElement: DebugElement;
	let dividerNativeElement: HTMLElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [DividerComponent],
		});

		fixture = TestBed.createComponent(DividerComponent);
		dividerComponent = fixture.componentInstance;
		dividerDebugElement = fixture.debugElement;
		dividerNativeElement = dividerDebugElement.nativeElement;
		fixture.detectChanges();
	});

	it('should work', () => {
		expect(dividerComponent instanceof DividerComponent).toBe(true);
	});

	it('should has a correct class names', () => {
		expect(dividerNativeElement.classList.contains('ui-divider')).toBe(true);
	});

	it('should by default is horizontal', () => {
		expect(dividerComponent.vertical).toBe(false);
	});

	it('should set vertical divider style', () => {
		dividerComponent.vertical = true;
		fixture.detectChanges();
		expect(dividerNativeElement.classList.contains('ui-divider--vertical')).toBe(true);
	});
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TilesModule, Tile } from 'carbon-components-angular/tiles';

import { CardComponent } from './card.component';

describe(CardComponent, () => {
	let component: CardComponent;
	let fixture: ComponentFixture<CardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CardComponent],
			imports: [TilesModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should has default theme is dark', () => {
		expect(component.theme).toBe('dark');
	});

	it('should uses carbon tiles as base of card', () => {
		const tile = fixture.debugElement.query(By.directive(Tile));

		expect(tile).not.toBeNull();
		expect(tile.nativeElement.classList.contains('ui-card')).toBeTruthy();
	});
});

import {
	Component,
	ChangeDetectionStrategy,
	Input,
	ElementRef,
	OnChanges,
	SimpleChange,
	ViewChildren,
	QueryList,
	AfterViewInit,
	ChangeDetectorRef,
	ViewEncapsulation,
	HostBinding,
} from '@angular/core';
import { CoerceNumber } from '@nx-mfe/client/common';
import { PasswordStrengthBarDirective } from './password-strength-bar.directive';
import { Status } from './password-strength.types';

@Component({
	selector: 'ui-password-strength',
	templateUrl: './password-strength.component.html',
	styleUrls: ['./password-strength.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthComponent implements OnChanges, AfterViewInit {
	@Input()
	public password?: string;

	@Input()
	public tests?: RegExp[];

	@Input()
	@CoerceNumber()
	public minLength: number = 6;

	@ViewChildren(PasswordStrengthBarDirective)
	private _barElements: QueryList<PasswordStrengthBarDirective>;

	@HostBinding('class.password-strength')
	protected _baseClass = true;

	constructor(public readonly elementRef: ElementRef, private readonly _cdr: ChangeDetectorRef) {}

	public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
		if (!changes['password'].isFirstChange()) {
			const password = changes['password'].currentValue;
			this.setBarStatuses(4, 'base');

			if (password) {
				const { filledBars, status } = this.getStatus(this.checkStrength(password));
				this.setBarStatuses(filledBars, status);
			}
		}
	}

	public ngAfterViewInit(): void {
		this.setBarStatuses(4, 'base');

		if (this.password) {
			const { filledBars, status } = this.getStatus(this.checkStrength(this.password));
			this.setBarStatuses(filledBars, status);
			this._cdr.markForCheck();
		}
	}

	public checkStrength(password: string): number {
		if (!this.tests || this.tests.length === 0) return 0;

		// plus 1 coz min length test
		const allTests = this.tests.length + 1;
		let passedMatches = 0;

		for (const regExp of this.tests) {
			regExp.test(password) && passedMatches++;
		}

		if (password.length >= this.minLength) passedMatches++;

		const strength = passedMatches / allTests;

		return strength;
	}

	private getStatus(strength: number): { filledBars: number; status: Status } {
		const barsCount = this._barElements.length;
		const coefForOneBar = 1 / barsCount;
		const a = strength === 0 ? 0 : strength / coefForOneBar;
		const filledBars = Math.floor(0 < a && a < 1 ? 1 : a);
		const statuses: Status[] = ['base', 'error', 'warning', 'warning', 'success'];
		const status = statuses[filledBars];

		return { filledBars, status };
	}

	private setBarStatuses(count: number, status: Status): void {
		const bars = this._barElements?.toArray();

		for (let i = 0; i < count; i++) {
			if (!bars[i]) return;
			bars[i].status = status;
		}
	}
}

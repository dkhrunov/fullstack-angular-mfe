import {
	Component,
	ChangeDetectionStrategy,
	forwardRef,
	Input,
	ViewEncapsulation,
	ViewChild,
	ElementRef,
	Optional,
	Renderer2,
	ChangeDetectorRef,
	HostBinding,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CoerceBoolean, CoerceNumber } from '@nx-mfe/client/common';
import { Label } from 'carbon-components-angular/input';
import { BehaviorSubject } from 'rxjs';
import { PasswordStrengthComponent } from '../password-strength';

@Component({
	selector: 'ui-password-input',
	templateUrl: './password-input.component.html',
	styleUrls: ['./password-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PasswordInputComponent),
			multi: true,
		},
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputComponent implements ControlValueAccessor {
	@Input()
	public value?: string;

	@Input()
	public placeholder: string = '';

	@Input()
	@CoerceBoolean()
	public disabled: boolean = false;

	@Input()
	@CoerceBoolean()
	public set invalid(value: any) {
		this._invalid = value;
		if (value && this._labelComponent) {
			// HACK to find element after change detections works
			setTimeout(() => {
				const invalidIcon = this._labelComponent.wrapper.nativeElement?.querySelector(
					'.bx--text-input__invalid-icon'
				);
				this._renderer.setStyle(invalidIcon, 'right', '3rem');
				this._renderer.setStyle(invalidIcon, 'z-index', '1');
			}, 0);
		}
	}

	public get invalid(): any {
		return this._invalid;
	}

	private _invalid: boolean = false;

	@Input()
	@CoerceBoolean()
	public set showStrength(value: any) {
		this._showStrength = value;
		if (value && this._labelComponent) {
			setTimeout(() => {
				const wrapper = this._labelComponent.wrapper.nativeElement;
				const passwordStrengthHeight =
					this._passwordStrengthElement.elementRef.nativeElement.offsetHeight + 'px';
				this._renderer.setStyle(wrapper, 'margin-bottom', passwordStrengthHeight);
			}, 0);
		}
	}

	public get showStrength(): any {
		return this._showStrength;
	}

	private _showStrength: boolean = false;

	@Input()
	public strengthTests?: RegExp[];

	@Input()
	@CoerceNumber()
	public strengthMinlength: number = 6;

	@HostBinding('class.ui-password-input')
	public baseClass = true;

	@ViewChild('input', { static: true })
	private _inputElement: ElementRef<HTMLInputElement>;

	@ViewChild(PasswordStrengthComponent)
	private _passwordStrengthElement: PasswordStrengthComponent;

	public touched: boolean = false;

	private _onChange = (_: any) => {};
	private _onTouched = () => {};

	private readonly _isPasswordVisible$ = new BehaviorSubject<boolean>(false);
	public readonly isPasswordVisible$ = this._isPasswordVisible$.asObservable();

	constructor(
		private readonly _cdr: ChangeDetectorRef,
		private readonly _renderer: Renderer2,
		@Optional() private readonly _labelComponent: Label
	) {}

	public writeValue(value: any): void {
		this.value = value;
		this._cdr.markForCheck();
	}

	public registerOnChange(fn: (_: any) => void): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean) {
		this.disabled = isDisabled;
	}

	public updateValue(insideValue: string) {
		this.value = insideValue;
		this._onChange(insideValue);
		this._onTouched();
	}

	public markAsTouched() {
		if (!this.touched) {
			this._onTouched();
			this.touched = true;
		}
	}

	public focus(): void {
		this._inputElement.nativeElement.focus();
	}

	public blur(): void {
		this._inputElement.nativeElement.blur();
	}

	public tooglePasswordVisibility(): void {
		this._isPasswordVisible$.next(!this._isPasswordVisible$.value);
	}
}

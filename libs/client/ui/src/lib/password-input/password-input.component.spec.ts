import { Component, DebugElement, Type } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PasswordInputModule } from './password-input.module'; // ?
import {
	FormControl,
	FormsModule,
	NgModel,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PasswordInputComponent } from './password-input.component';
import { InputModule, Label, TextInput } from 'carbon-components-angular/input';

describe(PasswordInputComponent, () => {
	let fixture: ComponentFixture<any>;

	function createComponent<T>(componentType: Type<T>, extraDeclarations: Type<any>[] = []) {
		TestBed.configureTestingModule({
			imports: [PasswordInputModule, FormsModule, ReactiveFormsModule, InputModule],
			declarations: [componentType, ...extraDeclarations],
		}).compileComponents();

		return TestBed.createComponent<T>(componentType);
	}

	describe('basic behaviors', () => {
		let passwordInputInstance: PasswordInputComponent;
		let passwordInputDebugElement: DebugElement;
		let inputElement: HTMLInputElement;
		let toggleButtonElement: HTMLButtonElement;

		beforeEach(() => {
			fixture = createComponent(PasswordInputComponent);
			fixture.detectChanges();

			passwordInputInstance = fixture.componentInstance;
			passwordInputDebugElement = fixture.debugElement;
			inputElement = <HTMLInputElement>(
				passwordInputDebugElement.query(By.css('input')).nativeElement
			);
			toggleButtonElement = <HTMLButtonElement>(
				passwordInputDebugElement.query(By.css('.ui-password-input__visibility-toggle'))
					.nativeElement
			);
		});

		it('should work', () => {
			expect(passwordInputInstance instanceof PasswordInputComponent).toBe(true);
		});

		it('should has a correct class names', () => {
			expect(inputElement.classList.contains('ui-password-input')).toBe(true);
			expect(
				passwordInputDebugElement.nativeElement.lastElementChild!.classList.contains(
					'ui-password-input__visibility-toggle'
				)
			).toBe(true);
		});

		it('should set the default values', () => {
			expect(passwordInputInstance.placeholder).toBe('');
			expect(passwordInputInstance.value).toBeUndefined();
			expect(passwordInputInstance.disabled).toBe(false);
			expect(passwordInputInstance.touched).toBe(false);
			expect(
				passwordInputInstance.inputElement.nativeElement instanceof HTMLInputElement
			).toBe(true);
			expect(
				passwordInputInstance.inputElement.nativeElement.classList.contains(
					'ui-password-input'
				)
			).toBe(true);
			expect(passwordInputInstance.invalid).toBe(false);
			expect(inputElement.classList.contains('bx--text-input--invalid')).toBe(false);
		});

		it('should set a placeholder', () => {
			passwordInputInstance.placeholder = 'test placeholder';
			fixture.detectChanges();
			expect(inputElement.placeholder).toBe('test placeholder');
		});

		it('should set invalid status', () => {
			passwordInputInstance.invalid = true;
			fixture.detectChanges();
			expect(passwordInputInstance.invalid).toBe(true);
			expect(inputElement.classList.contains('bx--text-input--invalid')).toBe(true);
		});

		it('should disabled work', async () => {
			passwordInputInstance.disabled = true;
			fixture.detectChanges();
			await fixture.whenStable();
			expect(passwordInputInstance.disabled).toBe(true);
			expect(inputElement.disabled).toBe(true);
			expect(toggleButtonElement.disabled).toBe(true);
		});

		it('should focus and blur work', () => {
			const onTouchedStub = jest.fn();
			passwordInputInstance.registerOnTouched(onTouchedStub);

			expect(inputElement === document.activeElement).toBe(false);

			passwordInputInstance.focus();
			fixture.detectChanges();
			expect(inputElement === document.activeElement).toBe(true);
			expect(passwordInputInstance.touched).toBe(false);

			passwordInputInstance.blur();
			fixture.detectChanges();
			expect(inputElement === document.activeElement).toBe(false);
			expect(onTouchedStub).toHaveBeenCalledTimes(1);
			expect(passwordInputInstance.touched).toBe(true);
		});
	});

	describe('toggle visibility', () => {
		let passwordInputInstance: PasswordInputComponent;
		let passwordInputDebugElement: DebugElement;
		let inputElement: HTMLInputElement;
		let toggleButtonElement: HTMLButtonElement;

		let isPasswordVisible: boolean | undefined;
		let subscription: Subscription;

		beforeEach(() => {
			fixture = createComponent(PasswordInputComponent);
			fixture.detectChanges();

			passwordInputInstance = fixture.componentInstance;
			passwordInputDebugElement = fixture.debugElement;
			inputElement = <HTMLInputElement>(
				passwordInputDebugElement.query(By.css('input')).nativeElement
			);
			toggleButtonElement = <HTMLButtonElement>(
				passwordInputDebugElement.query(By.css('.ui-password-input__visibility-toggle'))
					.nativeElement
			);
		});

		beforeEach(() => {
			subscription = passwordInputInstance.isPasswordVisible$.subscribe(
				(x) => (isPasswordVisible = x)
			);
		});

		afterAll(() => {
			subscription.unsubscribe();
		});

		it('should be hidden password value by default', () => {
			fixture.detectChanges();
			expect(isPasswordVisible).toBe(false);
			expect(inputElement.type).toBe('password');
			expect(
				toggleButtonElement.querySelector('.bx--btn__icon')!.getAttribute('ibmIcon')
			).toBe('view');
		});

		it('should toggle password visibility programmatically', () => {
			passwordInputInstance.tooglePasswordVisibility();
			fixture.detectChanges();
			expect(isPasswordVisible).toBe(true);
			expect(inputElement.type).toBe('text');
			expect(
				toggleButtonElement.querySelector('.bx--btn__icon')!.getAttribute('ibmIcon')
			).toBe('view--off');

			passwordInputInstance.tooglePasswordVisibility();
			fixture.detectChanges();
			expect(isPasswordVisible).toBe(false);
			expect(inputElement.type).toBe('password');
			expect(
				toggleButtonElement.querySelector('.bx--btn__icon')!.getAttribute('ibmIcon')
			).toBe('view');
		});

		it('should toggle password visibility by click on button ', () => {
			toggleButtonElement.click();
			fixture.detectChanges();
			expect(isPasswordVisible).toBe(true);
			expect(inputElement.type).toBe('text');
			expect(
				toggleButtonElement.querySelector('.bx--btn__icon')!.getAttribute('ibmIcon')
			).toBe('view--off');

			toggleButtonElement.click();
			fixture.detectChanges();
			expect(isPasswordVisible).toBe(false);
			expect(inputElement.type).toBe('password');
			expect(
				toggleButtonElement.querySelector('.bx--btn__icon')!.getAttribute('ibmIcon')
			).toBe('view');
		});
	});

	describe('with inputs', () => {
		let fixture: ComponentFixture<SimplePasswordInput>;
		let passwordInputInstance: PasswordInputComponent;
		let passwordInputDebugElement: DebugElement;
		let inputElement: HTMLInputElement;
		let toggleButtonElement: HTMLButtonElement;

		beforeEach(() => {
			fixture = createComponent(SimplePasswordInput);
			fixture.detectChanges();

			passwordInputDebugElement = fixture.debugElement.query(
				By.directive(PasswordInputComponent)
			);
			passwordInputInstance = passwordInputDebugElement.componentInstance;
			inputElement = <HTMLInputElement>(
				passwordInputDebugElement.query(By.css('input')).nativeElement
			);
			toggleButtonElement = <HTMLButtonElement>(
				passwordInputDebugElement.query(By.css('.ui-password-input__visibility-toggle'))
					.nativeElement
			);
		});

		it('should set value', async () => {
			const passwordStub = 'qwerty123';
			fixture.componentInstance.value = passwordStub;
			fixture.detectChanges();
			await fixture.whenStable();
			expect(passwordInputInstance.value).toBe(passwordStub);
			expect(inputElement.value).toBe(passwordStub);
		});

		it('should set a placeholder', async () => {
			const placeholderStub = 'i am placeholder';
			fixture.componentInstance.placeholder = placeholderStub;
			fixture.detectChanges();
			expect(passwordInputInstance.placeholder).toBe(placeholderStub);
			expect(inputElement.placeholder).toBe(placeholderStub);
		});

		it('should set disabled status', async () => {
			expect(passwordInputInstance.disabled).toBe(false);
			expect(inputElement.disabled).toBe(false);
			expect(toggleButtonElement.disabled).toBe(false);

			fixture.componentInstance.isDisabled = true;
			fixture.detectChanges();
			await fixture.whenStable();
			expect(passwordInputInstance.disabled).toBe(true);
			expect(toggleButtonElement.disabled).toBe(true);
			expect(inputElement.disabled).toBe(true);
		});

		it('should set invalid status', async () => {
			fixture.componentInstance.isInvalid = true;
			fixture.detectChanges();
			expect(passwordInputInstance.invalid).toBe(true);
			expect(inputElement.classList.contains('bx--text-input--invalid')).toBe(true);
		});
	});

	describe('with ngModel', () => {
		let fixture: ComponentFixture<PasswordInputWithNgModel>;
		let passwordInputInstance: PasswordInputComponent;
		let passwordInputDebugElement: DebugElement;
		let inputElement: HTMLInputElement;
		let toggleButtonElement: HTMLButtonElement;
		let ngModel: NgModel;

		beforeEach(() => {
			fixture = createComponent(PasswordInputWithNgModel);
			fixture.detectChanges();

			passwordInputDebugElement = fixture.debugElement.query(
				By.directive(PasswordInputComponent)
			);
			passwordInputInstance = passwordInputDebugElement.componentInstance;
			inputElement = <HTMLInputElement>(
				passwordInputDebugElement.query(By.css('input')).nativeElement
			);
			toggleButtonElement = <HTMLButtonElement>(
				passwordInputDebugElement.query(By.css('.ui-password-input__visibility-toggle'))
					.nativeElement
			);
			ngModel = passwordInputDebugElement.injector.get<NgModel>(NgModel);
		});

		it('should be a custom form control', () => {
			const valueAccessor = passwordInputDebugElement.injector.get(NG_VALUE_ACCESSOR)[0];
			expect(valueAccessor instanceof PasswordInputComponent).toBe(true);
		});

		it('should be pristine, untouched, and valid initially', () => {
			expect(ngModel.valid).toBe(true);
			expect(ngModel.pristine).toBe(true);
			expect(ngModel.touched).toBe(false);
		});

		it('should set the value', async () => {
			const passwordStub = 'qwerty123';
			const onChangeStub = jest.fn();
			const onTouchedStub = jest.fn();

			passwordInputInstance.registerOnChange(onChangeStub);
			passwordInputInstance.registerOnTouched(onTouchedStub);
			expect(passwordInputInstance.value).toBe('initial password');

			inputElement.value = passwordStub;
			inputElement.dispatchEvent(
				new Event('input', {
					bubbles: true,
					cancelable: true,
				})
			);

			expect(passwordInputInstance.value).toBe(passwordStub);
			expect(inputElement.value).toBe(passwordStub);
			expect(onChangeStub).toHaveBeenCalledTimes(1);
			expect(onTouchedStub).toHaveBeenCalledTimes(1);
		});

		it('should toggle the disabled state', async () => {
			expect(passwordInputInstance.disabled).toBe(false);
			expect(inputElement.disabled).toBe(false);
			expect(toggleButtonElement.disabled).toBe(false);

			fixture.componentInstance.isDisabled = true;
			fixture.detectChanges();
			await fixture.whenStable();
			expect(passwordInputInstance.disabled).toBe(true);
			expect(inputElement.disabled).toBe(true);
			expect(toggleButtonElement.disabled).toBe(true);
		});
	});

	describe('with form control', () => {
		let fixture: ComponentFixture<PasswordInputWithFormControl>;
		let passwordInputDebugElement: DebugElement;
		let passwordInputInstance: PasswordInputComponent;
		let testComponent: PasswordInputWithFormControl;
		let inputElement: HTMLInputElement;
		let toggleButtonElement: HTMLButtonElement;

		beforeEach(() => {
			fixture = createComponent(PasswordInputWithFormControl);
			fixture.detectChanges();

			passwordInputDebugElement = fixture.debugElement.query(
				By.directive(PasswordInputComponent)
			)!;
			passwordInputInstance = passwordInputDebugElement.componentInstance;
			testComponent = fixture.debugElement.componentInstance;
			inputElement = <HTMLInputElement>(
				passwordInputDebugElement.nativeElement.querySelector('input')
			);
			toggleButtonElement = <HTMLButtonElement>(
				passwordInputDebugElement.query(By.css('.ui-password-input__visibility-toggle'))
					.nativeElement
			);
		});

		it('should toggle the disabled state', async () => {
			expect(passwordInputInstance.disabled).toBe(false);
			expect(inputElement.disabled).toBe(false);
			expect(toggleButtonElement.disabled).toBe(false);

			testComponent.formControl.disable();
			fixture.detectChanges();
			await fixture.whenStable();

			expect(passwordInputInstance.disabled).toBe(true);
			expect(inputElement.disabled).toBe(true);
			expect(toggleButtonElement.disabled).toBe(true);

			testComponent.formControl.enable();
			fixture.detectChanges();
			await fixture.whenStable();

			expect(passwordInputInstance.disabled).toBe(false);
			expect(inputElement.disabled).toBe(false);
			expect(toggleButtonElement.disabled).toBe(false);
		});
	});

	describe('with IbmLabel', () => {
		let fixture: ComponentFixture<PasswordInputWithIbmLabel>;
		let passwordInputDebugElement: DebugElement;
		let passwordInputInstance: PasswordInputComponent;
		let ibmLabelDebugElement: DebugElement;
		let ibmInputDebugElement: DebugElement;

		beforeEach(() => {
			fixture = createComponent(PasswordInputWithIbmLabel);
			fixture.detectChanges();

			passwordInputDebugElement = fixture.debugElement.query(
				By.directive(PasswordInputComponent)
			)!;
			passwordInputInstance = passwordInputDebugElement.componentInstance;
			ibmLabelDebugElement = fixture.debugElement.query(By.directive(Label))!;
			ibmInputDebugElement = fixture.debugElement.query(By.directive(TextInput))!;
		});

		it('should set invalid icon before password toggle button', fakeAsync(() => {
			expect(ibmLabelDebugElement.query(By.css('.bx--text-input__invalid-icon'))).toBeFalsy();

			fixture.componentInstance.isInvalid = true;
			fixture.detectChanges();
			const invalidIconElement = <SVGElement>(
				ibmLabelDebugElement.query(By.css('.bx--text-input__invalid-icon')).nativeElement
			);
			tick();
			expect(passwordInputInstance.invalid).toBe(true);
			expect(ibmInputDebugElement.componentInstance.invalid).toBe(true);
			expect(invalidIconElement).toBeTruthy();
			expect(invalidIconElement.style.right).toBe('3rem');
		}));
	});
});

/** Simple component for testing. */
@Component({
	template: `
		<div class="test"></div>
		<ui-password-input
			[placeholder]="placeholder"
			[invalid]="isInvalid"
			[disabled]="isDisabled"
			[value]="value"
		>
		</ui-password-input>
	`,
})
class SimplePasswordInput {
	public placeholder: string = 'enter password';
	public isInvalid: boolean = false;
	public isDisabled: boolean = false;
	public value: string = 'initial password';
}

/** Test component with ngModel. */
@Component({
	template: `
		<ui-password-input [disabled]="isDisabled" [(ngModel)]="value"></ui-password-input>
	`,
})
class PasswordInputWithNgModel {
	value: string = 'initial password';
	isDisabled: boolean = false;
}

/** Test component with reactive forms. */
@Component({ template: ` <ui-password-input [formControl]="formControl"></ui-password-input> ` })
class PasswordInputWithFormControl {
	public formControl = new FormControl('initial password');
}

/** Test component with IbmLabel wrapper. */
@Component({
	template: `
		<ibm-label labelInputID="password" [invalid]="isInvalid">
			Password
			<div uiPasswordInputWrapper>
				<ui-password-input id="password" [formControl]="formControl" [invalid]="isInvalid">
				</ui-password-input>
			</div>
		</ibm-label>
	`,
})
class PasswordInputWithIbmLabel {
	public formControl = new FormControl('initial password');
	public isInvalid: boolean = false;
}

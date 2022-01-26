import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
	public static confirm(compareWith: string): ValidatorFn {
		return confirmValidator(compareWith);
	}
}

export function confirmValidator(compareWith: string): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (
			!!control.parent &&
			control.parent instanceof FormGroup &&
			control.parent.get(compareWith)?.value !== control.value
		) {
			return { confirm: true, error: true };
		}

		return {};
	};
}

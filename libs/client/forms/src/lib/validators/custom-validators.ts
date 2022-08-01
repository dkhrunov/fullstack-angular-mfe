import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
	public static confirm(compareWith: string): ValidatorFn {
		return confirmValidator(compareWith);
	}
}

export function confirmValidator(compareWith: string): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (
			!!control.parent &&
			control.parent instanceof UntypedFormGroup &&
			control.parent.get(compareWith)?.value !== control.value
		) {
			return { confirm: true, error: true };
		}

		return {};
	};
}

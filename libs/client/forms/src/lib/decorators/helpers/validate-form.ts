import { FormGroup } from '@angular/forms';

export function validateForm(form: FormGroup): void {
	for (const i in form.controls) {
		if (Object.prototype.hasOwnProperty.call(form.controls, i)) {
			form.controls[i].markAllAsTouched();
			form.controls[i].markAsDirty();
			form.controls[i].updateValueAndValidity();
		}
	}
}

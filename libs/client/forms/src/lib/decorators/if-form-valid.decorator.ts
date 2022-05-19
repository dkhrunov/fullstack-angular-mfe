import { FormGroup } from '@angular/forms';

import { generateMetadataKey, validateForm } from './helpers';

/**
 * Decorated method will be executed if the form is valid.
 * -----
 *
 * Method decorator.
 *
 * **Note:**
 * form validation is performed first, then the body of the method being decorated is called.
 *
 * @example
 * @Form()
 * public form: FormGroup;
 *
 * @IfFormValid()
 * public submit(): void {...}
 *
 * @param formId Identificator provided in @Form('id') decorator, if not sets when used default metadata key
 */
export function IfFormValid(formId?: string | symbol | number): MethodDecorator {
	return function (
		target: any,
		_propertyKey: string | symbol,
		descriptor: TypedPropertyDescriptor<any>
	): TypedPropertyDescriptor<any> {
		const metadataKey = generateMetadataKey(formId);
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: unknown[]) {
			const form: FormGroup = target[metadataKey];

			if (!(form instanceof FormGroup)) {
				throw new Error('Form property must be a FormGroup');
			}

			validateForm(form);

			if (form.valid) {
				originalMethod.apply(this, args);
			}
		};

		return descriptor;
	};
}

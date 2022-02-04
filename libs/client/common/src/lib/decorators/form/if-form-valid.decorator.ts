import { FormGroup } from '@angular/forms';

import { generateMetadataKey, validateForm } from './helpers';

export function IfFormValid(formPropName: string | number) {
	return (target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
		const metadataKey = generateMetadataKey(formPropName);
		const form: FormGroup = target[metadataKey];

		const originalMethod = descriptor.value;

		descriptor.value = function (...args: unknown[]) {
			validateForm(form);

			if (form.valid) {
				originalMethod.apply(this, args);
			}
		};

		return descriptor;
	};
}

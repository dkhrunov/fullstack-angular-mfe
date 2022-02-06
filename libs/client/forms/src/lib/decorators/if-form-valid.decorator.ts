import { FormGroup } from '@angular/forms';

import { generateMetadataKey, validateForm } from './helpers';

/**
 * Декоратор метода.
 *
 * Декорируемый метод будет выполнен, если форма будет валидна.
 *
 * **Примечание:**
 * сначала выполняется валидация формы, потом вызов тела декорируемого метода.
 * @param formPropName имя своства в котором храниться форма, данная форма и будет валидироваться
 */
export function IfFormValid(formPropName: string | number): MethodDecorator {
	return function (
		target: any,
		_propertyKey: string | symbol,
		descriptor: TypedPropertyDescriptor<any>
	): TypedPropertyDescriptor<any> {
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

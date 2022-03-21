import { generateMetadataKey } from './helpers';

/**
 * Creates the metadata for working with this form in other decorators, like IfFormValid and etc.
 * ------
 *
 * Property decorator.
 *
 * @example
 * @Form()
 * public form: FormGroup;
 *
 * // OR with ID
 *
 * @Form('uniqName')
 * public form: FormGroup;
 *
 * @IfFormValid('uniqName')
 * public submit(): void {...}
 *
 * @param id Sets id for decorated form, if not sets when used default metadata key
 */
export function Form(id?: string | symbol | number): PropertyDecorator {
	return (target: any, propertyKey: string | symbol): void => {
		const metadataKey = generateMetadataKey(id);

		Object.defineProperty(target, propertyKey, {
			set: (value) => (target[metadataKey] = value),
			get: () => target[metadataKey],
		});
	};
}

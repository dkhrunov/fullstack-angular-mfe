import { AbstractControlOptions, AsyncValidatorFn, FormBuilder, ValidatorFn } from '@angular/forms';

import { DecoratorsModule } from '../decorators.module';
import { generateMetadataKey } from './helpers';

export function Form(
	controls: {
		[field: string]: [] | [ValidatorFn[]] | [ValidatorFn[], AsyncValidatorFn[]];
	},
	options?: AbstractControlOptions | null | undefined
) {
	return (target: any, propertyKey: string) => {
		const controlsConfig = Object.entries(controls).reduce((res, [controlName, value]) => {
			if (value.length !== 0) {
				// @ts-ignore
				res[controlName] = [null, value[0], value[1]];
			} else {
				// @ts-ignore
				res[controlName] = [null];
			}

			return res;
		}, {});
		const form = DecoratorsModule.injector.get(FormBuilder).group(controlsConfig, options);
		const metadataKey = generateMetadataKey(propertyKey);
		target[metadataKey] = form;

		Object.defineProperty(target, propertyKey, {
			value: form,
		});
	};
}

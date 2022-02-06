import { AbstractControlOptions, AsyncValidatorFn, FormBuilder, ValidatorFn } from '@angular/forms';
import { InjectorContainerModule } from '@nx-mfe/client/core';

import { generateMetadataKey } from './helpers';

/**
 * Декоратор свойства.
 *
 * Создает форму (FormGroup). Начальное значение для всех контролов формы по дефолту устанавливается в null.
 *
 * Также добавляет метаданые в класс, чтобы другие декораторы, например @IfFormValid(), могли работать с данной формой.
 *
 * **Примечание:**
 * чтобы установить другое дефолтное значение для формы - нужно в конструкторе установить для контрола/формы необходимое значение:
 * @example
 * this.form.setValue({
 *			email: 'test@test.com',
 *			password: null,
 *			rememberMe: true,
 *		});
 *
 * @param controls коллекция контролов формы. Ключом для каждого элемента является имя,
 * под которым будет зарегистрирован контрол формы
 * @param options объект параметров конфигурации для FormGroup
 */
export function Form(
	controls: {
		[field: string]: [] | [ValidatorFn[]] | [ValidatorFn[], AsyncValidatorFn[]];
	},
	options?: AbstractControlOptions | null | undefined
): PropertyDecorator {
	return (target: any, propertyKey: string | symbol): void => {
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
		const form = InjectorContainerModule.injector
			.get(FormBuilder)
			.group(controlsConfig, options);
		const metadataKey = generateMetadataKey(propertyKey);
		target[metadataKey] = form;

		Object.defineProperty(target, propertyKey, {
			value: form,
		});
	};
}

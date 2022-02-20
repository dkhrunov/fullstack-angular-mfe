import { SimpleChanges } from '@angular/core';

/**
 * Стратегии реагирования на изменения в @Input() переменной компонента.
 */
export enum EChangesStrategy {
	/**
	 * Вызывается на каждое изменение.
	 */
	Each,
	/**
	 * Вызывается только на первое изменение.
	 */
	First,
	/**
	 * Вызывается на каждое изменение, кроме первого.
	 */
	NonFirst,
}

export interface TrackChangesOptions {
	/**
	 * Стратегия реагирования.
	 * @default EChangesStrategy.Each
	 */
	strategy?: EChangesStrategy;
	/**
	 * Сравнивать предыдущие значение с текущим и выполнять метод, только при различии значений.
	 * Значения должны быть имутабельными, так как сравниваются значения по ссылке.
	 * @default false
	 */
	compare?: boolean;
}

const defaultOptions: TrackChangesOptions = {
	strategy: EChangesStrategy.Each,
	compare: false,
};

/**
 * Декоратор метода ngOnChanges, который вызывает указанный метолд при изменении значения в @Input() prop.
 *
 * @param prop Имя переменной, которая будет отслеживаться
 * @param methodName Название метода, которое будет вызвано при изменении переменной
 * @param options Стратегия реагирования
 */
export function TrackChanges<T>(
	prop: string,
	methodName: string,
	options?: TrackChangesOptions
): MethodDecorator {
	return function (
		target: any,
		_propertyKey: string | symbol,
		descriptor: PropertyDescriptor
	): TypedPropertyDescriptor<any> {
		const _options = { ...defaultOptions, ...options };
		const originalMethod = descriptor.value as (changes: SimpleChanges) => void;

		descriptor.value = function (changes: SimpleChanges): void {
			if (changes && changes[prop] && changes[prop].currentValue !== undefined) {
				const isFirstChange = changes[prop].firstChange;
				const isDifference = changes[prop].previousValue !== changes[prop].currentValue;
				const shouldCompareValues = _options.compare;

				if (
					_options.strategy === EChangesStrategy.Each ||
					(_options.strategy === EChangesStrategy.First && isFirstChange) ||
					(_options.strategy === EChangesStrategy.NonFirst && !isFirstChange)
				) {
					if (!shouldCompareValues) {
						target[methodName].call(this, changes[prop].currentValue as T);
					} else if (isDifference) {
						target[methodName].call(this, changes[prop].currentValue as T);
					}
				}
			}

			originalMethod.call(this, changes);
		};

		return descriptor;
	};
}

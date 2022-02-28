import { SimpleChanges } from '@angular/core';

/**
 * Strategy for changing the component's @Input() variable.
 */
export enum EChangesStrategy {
	/**
	 * Called on every change.
	 */
	Each,
	/**
	 * Called only on the first change.
	 */
	First,
	/**
	 * Called on every change except the first.
	 */
	NonFirst,
}

export interface TrackChangesOptions {
	/**
	 * Change strategy.
	 * @default EChangesStrategy.Each
	 */
	strategy?: EChangesStrategy;
	/**
	 * Compare the previous value with the current one
	 * and execute the method only if the values differ.
	 *
	 * Values must be immutable, as values are compared by reference.
	 * @default false
	 */
	compare?: boolean;
}

const defaultOptions: TrackChangesOptions = {
	strategy: EChangesStrategy.Each,
	compare: false,
};

/**
 * Decorator of lifecycle hook ngOnChanges, that call specified method when changes prop (@Input) value.
 * -------
 *
 * Method decorator.
 *
 * @param prop Variable name of Input, that will be call method when changes.
 * @param methodName The name of the method that will be called when the variable changes.
 * @param options Options.
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

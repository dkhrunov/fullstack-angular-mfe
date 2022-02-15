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

/**
 * Декоратор метода ngOnChanges, который вызывает определенную функцию при изменении значения в @Input() переменной.
 *
 * @param prop Имя переменной, которая будет отслеживаться
 * @param methodName Название метода, которое будет вызвано при изменении переменной
 * @param strategy Стратегия реагирования
 */
export function TrackChanges<T>(
	prop: string,
	methodName: string,
	strategy: EChangesStrategy = EChangesStrategy.Each
): MethodDecorator {
	return function (
		target: any,
		_propertyKey: string | symbol,
		descriptor: PropertyDescriptor
	): TypedPropertyDescriptor<any> {
		const originalMethod = descriptor.value as (changes: SimpleChanges) => void;

		descriptor.value = function (changes: SimpleChanges): void {
			if (changes && changes[prop] && changes[prop].currentValue !== undefined) {
				const isFirstChange = changes[prop].firstChange;
				if (
					strategy === EChangesStrategy.Each ||
					(strategy === EChangesStrategy.First && isFirstChange) ||
					(strategy === EChangesStrategy.NonFirst && !isFirstChange)
				) {
					target[methodName].call(this, changes[prop].currentValue as T);
				}
			}

			originalMethod.call(this, changes);
		};

		return descriptor;
	};
}

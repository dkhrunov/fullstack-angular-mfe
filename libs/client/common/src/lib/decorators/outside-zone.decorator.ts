import { NgZone, ɵɵdirectiveInject as directiveInject } from '@angular/core';

/**
 * Execute decorated method outside NgZone, that means this method don`t trigger Angular change detection mechanism.
 * ----------
 *
 * Method decorator. <br/>
 *
 * NgZone triggers when:
 * - Component initialization;
 * - In event listener;
 * - HTTP Data Request;
 * - MacroTasks, such as setTimeout() or setInterval();
 * - MicroTasks, such as Promise.then() or fetch();
 * - Other async operations.
 * @constructor
 */
export function OutsideZone() {
	return function (
		_target: any,
		_propertyKey: string | symbol,
		descriptor: PropertyDescriptor
	): TypedPropertyDescriptor<any> {
		const source = descriptor.value;

		descriptor.value = function (...args: unknown[]): () => unknown {
			return directiveInject(NgZone).runOutsideAngular(() => source.call(this, ...args));
		};

		return descriptor;
	};
}

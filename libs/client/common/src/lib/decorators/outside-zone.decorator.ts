import { NgZone, ɵɵdirectiveInject as directiveInject } from '@angular/core';

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

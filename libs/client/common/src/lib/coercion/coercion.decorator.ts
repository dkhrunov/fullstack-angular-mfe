import { coerceBoolean } from './boolean';
import { coerceCssPixel } from './css-pixel';
import { coerceNumber } from './number';

function propDecoratorFactory<T, D>(
	name: string,
	fallback: (v: T) => D
): (target: unknown, propName: string) => void {
	function propDecorator(
		target: unknown,
		propName: string,
		originalDescriptor?: TypedPropertyDescriptor<unknown>
	): any {
		const privatePropName = `@@__nxMfePropDecorator__${propName}`;

		if (Object.prototype.hasOwnProperty.call(target, privatePropName)) {
			console.warn(
				`The prop "${privatePropName}" is already exist, it will be overrided by ${name} decorator.`
			);
		}

		Object.defineProperty(target, privatePropName, {
			configurable: true,
			writable: true,
		});

		return {
			get(): string {
				return originalDescriptor && originalDescriptor.get
					? originalDescriptor.get.bind(this)()
					: this[privatePropName];
			},
			set(value: T): void {
				if (originalDescriptor && originalDescriptor.set) {
					originalDescriptor.set.bind(this)(fallback(value));
				}
				this[privatePropName] = fallback(value);
			},
		};
	}

	return propDecorator;
}

export function CoerceBoolean(): any {
	return propDecoratorFactory('InputBoolean', coerceBoolean);
}

export function CoerceCssPixel(): any {
	return propDecoratorFactory('InputCssPixel', coerceCssPixel);
}

export function CoerceNumber(fallbackValue?: any): any {
	return propDecoratorFactory('InputNumber', (value: string | number) =>
		coerceNumber(value, fallbackValue)
	);
}

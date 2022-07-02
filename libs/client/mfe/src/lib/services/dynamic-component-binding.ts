import { ComponentRef, EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { MfeOutletInputs, MfeOutletOutputs } from '../types';

/**
 * The service that binds the dynamic component.
 */
@Injectable()
export class DynamicComponentBinding implements OnDestroy {
	private readonly _destroy$ = new Subject<void>();

	public ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	/**
	 * Bind provided MfeOutletInputs to dynamic component.
	 * @param componentRef Reference of component.
	 * @param inputs Provided MfeOutletInputs.
	 */
	public bindInputs<T = unknown>(componentRef: ComponentRef<T>, inputs: MfeOutletInputs): void {
		for (const key in inputs) {
			if (Object.prototype.hasOwnProperty.call(inputs, key)) {
				(componentRef.instance as any)[key] = inputs[key];
			}
		}
	}

	/**
	 * Bind provided MfeOutletOutputs to dynamic component.
	 * @param componentRef Reference of component.
	 * @param outputs Provided MfeOutletOutputs.
	 */
	public bindOutputs<T = unknown>(
		componentRef: ComponentRef<T>,
		outputs: MfeOutletOutputs
	): void {
		this._validateOutputs(componentRef, outputs);

		for (const key in outputs) {
			if (Object.prototype.hasOwnProperty.call(outputs, key)) {
				((componentRef.instance as any)[key] as EventEmitter<any>)
					.pipe(takeUntil(this._destroy$))
					.subscribe((event) => {
						const handler = outputs[key];
						if (handler) {
							// in case the output has not been provided at all
							handler(event);
						}
					});
			}
		}
	}

	/**
	 * Unbind all outputs.
	 */
	public unbindOutputs(): void {
		this._destroy$.next();
	}

	/**
	 * Validate MfeOutletOutputs of dynamic component.
	 * @param componentRef Reference of component.
	 * @param outputs Provided MfeOutletOutputs.
	 */
	private _validateOutputs<T = unknown>(
		componentRef: ComponentRef<T>,
		outputs: MfeOutletOutputs
	): void {
		Object.keys(outputs).forEach((key) => {
			const isComponentHaveOutput = Object.prototype.hasOwnProperty.call(
				componentRef.instance,
				key
			);

			if (!isComponentHaveOutput) {
				throw new Error(
					`Dynamically bound Output "${key}" is not declared in target component ${componentRef.componentType.constructor.name}.`
				);
			}

			if (!((componentRef.instance as any)[key] instanceof EventEmitter)) {
				throw new Error(
					`Dynamically bound Output "${key}" must be an instance of EventEmitter.`
				);
			}

			if (!(outputs[key] instanceof Function)) {
				throw new Error(`Dynamically bound Output "${key}" must be a function.`);
			}
		});
	}
}

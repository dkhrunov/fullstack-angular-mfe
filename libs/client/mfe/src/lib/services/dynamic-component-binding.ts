import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import {
	DynamicComponentInputs,
	DynamicComponentOutputs,
	MfeOutletInputs,
	MfeOutletOutputs,
} from '../types';

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
	 * @param componentInputs Array of available component MfeOutletInputs.
	 * @param inputs Provided MfeOutletInputs.
	 * @param componentInstance Dynamic component instance.
	 */
	public bindInputs(
		componentInputs: DynamicComponentInputs,
		inputs: MfeOutletInputs,
		componentInstance: any
	): void {
		this.validateInputs(componentInputs, inputs, componentInstance);

		componentInputs.forEach((input) => {
			componentInstance[input.propName] = inputs[input.templateName];
		});
	}

	/**
	 * Bind provided MfeOutletOutputs to dynamic component.
	 * @param componentOutputs Array of available component MfeOutletOutputs.
	 * @param outputs Provided MfeOutletOutputs.
	 * @param componentInstance Dynamic component instance.
	 */
	public bindOutputs(
		componentOutputs: DynamicComponentOutputs,
		outputs: MfeOutletOutputs,
		componentInstance: any
	): void {
		this.validateOutputs(componentOutputs, outputs, componentInstance);

		componentOutputs.forEach((output) => {
			(componentInstance[output.propName] as EventEmitter<any>)
				.pipe(takeUntil(this._destroy$))
				.subscribe((event) => {
					const handler = outputs[output.templateName];
					if (handler) {
						// in case the output has not been provided at all
						handler(event);
					}
				});
		});
	}

	/**
	 * Validate MfeOutletInputs of dynamic component.
	 * @param componentInputs Array of available component MfeOutletInputs.
	 * @param inputs Provided MfeOutletInputs.
	 * @param componentInstance Dynamic component instance.
	 */
	public validateInputs(
		componentInputs: DynamicComponentInputs,
		inputs: MfeOutletInputs,
		componentInstance: any
	): void {
		Object.keys(inputs).forEach((userInputKey) => {
			const isComponentHaveInput = componentInputs.some(
				(componentInput) => componentInput.templateName === userInputKey
			);
			if (!isComponentHaveInput) {
				throw new Error(
					`Input "${userInputKey}" is not input of ${componentInstance.constructor.name}.`
				);
			}
		});
	}

	/**
	 * Validate MfeOutletOutputs of dynamic component.
	 * @param componentOutputs Array of available component MfeOutletOutputs.
	 * @param outputs Provided MfeOutletOutputs.
	 * @param componentInstance Dynamic component instance.
	 */
	public validateOutputs(
		componentOutputs: DynamicComponentOutputs,
		outputs: MfeOutletOutputs,
		componentInstance: any
	): void {
		componentOutputs.forEach((output) => {
			if (!(componentInstance[output.propName] instanceof EventEmitter)) {
				throw new Error(`Output "${output.propName}" must be an instance of EventEmitter`);
			}
		});

		const outputsKeys = Object.keys(outputs);

		outputsKeys.forEach((key) => {
			const isComponentHaveOutput = componentOutputs.some(
				(output) => output.templateName === key
			);

			if (!isComponentHaveOutput) {
				throw new Error(
					`Output "${key}" is not output ${componentInstance.constructor.name}.`
				);
			}

			if (!(outputs[key] instanceof Function)) {
				throw new Error(`Output "${key}" must be a function`);
			}
		});
	}
}

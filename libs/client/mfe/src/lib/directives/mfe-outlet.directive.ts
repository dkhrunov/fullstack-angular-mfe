import {
	AfterViewInit,
	ChangeDetectorRef,
	Compiler,
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	Directive,
	EventEmitter,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	TemplateRef,
	Type,
	ViewContainerRef,
} from '@angular/core';
import { EChangesStrategy, OutsideZone, TrackChanges } from '@nx-mfe/client/common';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';

import { DefaultMfeOutletFallbackComponent, DefaultMfeOutletLoaderComponent } from '../components';
import { loadMfeComponent, loadMfeModule } from '../loaders';
import { MfeComponentsCache } from '../services';

// TODO вынеси
type CustomInputs = Record<string, unknown>;
// TODO вынеси
type CustomOutputs = Record<string, (event: unknown) => void>;

// TODO вынеси
type ComponentInputs = ComponentFactory<unknown>['inputs'];
// TODO вынеси
type ComponentOutputs = ComponentFactory<unknown>['outputs'];

// TODO jsDoc
// TODO jsDoc
// TODO jsDoc
// TODO jsDoc
// TODO jsDoc

// TODO актуализировать доку
/**
 * Micro-frontend directive for plugin-based approach.
 * -------------
 *
 * This directive allows you to load micro-frontend inside in HTML template.
 *
 * @example
 * <!-- Loads entry component from dashboard micro-frontend -->
 * <ng-container *mfeOutlet="'dashboard-mfe/entry'"></ng-container>
 *
 * @example
 * <!--
 *   Loads entry component from dashboard micro-frontend
 *   and provide context aka data ({ a: 1, b: 2 }) to entry component
 * -->
 * <ng-container *mfeOutlet="'dashboard-mfe/entry'; context: { a: 1, b: 2 } "></ng-container>
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[mfeOutlet]',
	exportAs: 'mfeOutlet',
})
export class MfeOutletDirective implements OnChanges, AfterViewInit, OnDestroy {
	@Input('mfeOutlet')
	public mfe: string;

	@Input('mfeOutletInputs')
	public inputs?: CustomInputs;

	@Input('mfeOutletOutputs')
	public outputs?: CustomOutputs;

	@Input('mfeOutletInjector')
	public injector?: Injector;

	// TODO
	@Input('mfeOutletLoader')
	public loader?: TemplateRef<void>;

	@Input('mfeOutletLoaderDelay')
	public loaderDelay = 300;

	// TODO
	@Input('mfeOutletFallback')
	public fallback?: TemplateRef<void>;

	private _mfeComponentFactory?: ComponentFactory<unknown>;
	private _mfeComponentRef?: ComponentRef<unknown>;
	private _loaderComponentRef?: ComponentRef<unknown>;
	private _fallbackComponentRef?: ComponentRef<unknown>;
	private readonly _destroy$ = new Subject<void>();

	constructor(
		private readonly _vcr: ViewContainerRef,
		private readonly _cfr: ComponentFactoryResolver,
		private readonly _compiler: Compiler,
		private readonly _injector: Injector,
		private readonly _cache: MfeComponentsCache
	) {}

	@TrackChanges('mfe', '_renderMfe', { strategy: EChangesStrategy.NonFirst })
	@TrackChanges('inputs', '_bindInputsOnChanges', {
		strategy: EChangesStrategy.NonFirst,
		compare: true,
	})
	public ngOnChanges(): void {
		return;
	}

	public ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();

		this._destroyDisplayedComponent();
	}

	public ngAfterViewInit(): void {
		this._renderMfe();
	}

	// TODO не обновляет view в ChangeDetectionStrategy.OnPush
	protected _bindInputsOnChanges(): void {
		if (!this._mfeComponentRef || !this._mfeComponentFactory) return;

		this._validateInputs(this._mfeComponentFactory.inputs, this.inputs ?? {});
		this._bindInputs(
			this._mfeComponentFactory.inputs,
			this.inputs ?? {},
			this._mfeComponentRef?.instance
		);

		// Workaround for bug related to Angular and dynamic components.
		// Link - https://github.com/angular/angular/issues/36667#issuecomment-926526405
		this._mfeComponentRef?.injector.get(ChangeDetectorRef).detectChanges();
	}

	protected async _renderMfe(): Promise<void> {
		try {
			if (this._mfeComponentRef) {
				this._destroyDisplayedComponent();
			}

			this._showLoader();

			if (this._cache.isMfeRegistered(this.mfe)) {
				this._mfeComponentFactory = await lastValueFrom(this._cache.getValue(this.mfe));

				this._showMfe(this._mfeComponentFactory);
				this._bindMfeComponent();
			} else {
				this._cache.registerMfe(this.mfe);

				const [MfeModule, MfeComponent] = await this._loadMfe();
				this._mfeComponentFactory = await this._resolveMfeComponentFactory(
					MfeModule,
					MfeComponent
				);

				this._cache.setValue(this.mfe, this._mfeComponentFactory);

				this._showMfe(this._mfeComponentFactory);
				this._bindMfeComponent();
			}
		} catch (e) {
			console.error(e);

			if (this._cache.isMfeRegistered(this.mfe)) {
				this._cache.setError(this.mfe, e);
			}

			this._showFallback();
		}
	}

	@OutsideZone()
	private _loadMfe(): Promise<[Type<unknown>, Type<unknown>]> {
		let MfeModule: Type<unknown>;
		let MfeComponent: Type<unknown>;

		// Delay - anti-flicker
		const delayPromise = new Promise((resolve) => setTimeout(resolve, this.loaderDelay));

		// The MfeModule must be loaded first, then the MfeComponent, in that order
		return loadMfeModule(this.mfe)
			.then((Module) => {
				MfeModule = Module;
			})
			.then(() => loadMfeComponent(this.mfe))
			.then((Component) => {
				MfeComponent = Component;
			})
			.then(() => delayPromise)
			.then(() => [MfeModule, MfeComponent]);
	}

	private async _resolveMfeComponentFactory(
		Module: Type<unknown>,
		Component: Type<unknown>
	): Promise<ComponentFactory<unknown>> {
		const moduleFactory = await this._compiler.compileModuleAsync(Module);
		const moduleRef = moduleFactory.create(this.injector ?? this._injector);

		return moduleRef.componentFactoryResolver.resolveComponentFactory(Component);
	}

	private _showMfe(componentFactory: ComponentFactory<unknown>): void {
		this._vcr.clear();

		const componentRef = this._vcr.createComponent(
			componentFactory,
			0,
			this.injector ?? this._injector
		);
		componentRef.changeDetectorRef.detectChanges();
		this._mfeComponentRef = componentRef;
	}

	private _showLoader(): void {
		this._vcr.clear();

		if (this.loader) {
			this._vcr.createEmbeddedView(this.loader);
		} else {
			const loaderFactory = this._cfr.resolveComponentFactory(
				DefaultMfeOutletLoaderComponent
			);
			const loaderRef = this._vcr.createComponent(loaderFactory);
			loaderRef.changeDetectorRef.detectChanges();
			this._loaderComponentRef = loaderRef;
		}
	}

	private _showFallback(): void {
		this._vcr.clear();

		if (this.fallback) {
			this._vcr.createEmbeddedView(this.fallback);
		} else {
			const fallbackFactory = this._cfr.resolveComponentFactory(
				DefaultMfeOutletFallbackComponent
			);
			const fallbackRef = this._vcr.createComponent(fallbackFactory);
			fallbackRef.changeDetectorRef.detectChanges();
			this._fallbackComponentRef = fallbackRef;
		}
	}

	private _bindMfeComponent(): void {
		if (!this._mfeComponentRef) {
			throw new Error(`ComponentRef of micro-frontend '${this.mfe}' dont exist`);
		}

		if (!this._mfeComponentFactory) {
			throw new Error(`ComponentFactory of micro-frontend '${this.mfe}' dont exist`);
		}

		this._validateInputs(this._mfeComponentFactory.inputs, this.inputs ?? {});
		this._validateOutputs(
			this._mfeComponentFactory.outputs,
			this.outputs ?? {},
			this._mfeComponentRef?.instance
		);

		this._bindInputs(
			this._mfeComponentFactory.inputs,
			this.inputs ?? {},
			this._mfeComponentRef?.instance
		);
		this._bindOutputs(
			this._mfeComponentFactory.outputs,
			this.outputs ?? {},
			this._mfeComponentRef?.instance
		);

		// Workaround for bug related to Angular and dynamic components.
		// Link - https://github.com/angular/angular/issues/36667#issuecomment-926526405
		this._mfeComponentRef?.injector.get(ChangeDetectorRef).detectChanges();
	}

	// TODO to bindingService
	private _validateInputs(componentInputs: ComponentInputs, inputs: CustomInputs): void {
		Object.keys(inputs).forEach((userInputKey) => {
			const componentHaveThatInput = componentInputs.some(
				(componentInput) => componentInput.templateName === userInputKey
			);
			if (!componentHaveThatInput) {
				throw new Error(`Input ${userInputKey} is not ${this.mfe} input.`);
			}
		});
	}

	// TODO to bindingService
	private _validateOutputs(
		componentOutputs: ComponentOutputs,
		outputs: CustomOutputs,
		componentInstance: any
	): void {
		componentOutputs.forEach((output) => {
			if (!(componentInstance[output.propName] instanceof EventEmitter)) {
				throw new Error(`Output ${output.propName} must be a typeof EventEmitter`);
			}
		});

		const outputsKeys = Object.keys(outputs);
		outputsKeys.forEach((key) => {
			const componentHaveThatOutput = componentOutputs.some(
				(output) => output.templateName === key
			);
			if (!componentHaveThatOutput) {
				throw new Error(`Output ${key} is not ${this.mfe} output.`);
			}
			if (!(outputs[key] instanceof Function)) {
				throw new Error(`Output ${key} must be a function`);
			}
		});
	}

	// TODO to bindingService
	private _bindInputs(
		componentInputs: ComponentInputs,
		inputs: CustomInputs,
		componentInstance: any
	): void {
		componentInputs.forEach((input) => {
			componentInstance[input.propName] = inputs[input.templateName];
		});
	}

	// TODO to bindingService
	private _bindOutputs(
		componentOutputs: ComponentOutputs,
		outputs: CustomOutputs,
		componentInstance: any
	): void {
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

	private _destroyDisplayedComponent() {
		this._loaderComponentRef?.destroy();
		this._fallbackComponentRef?.destroy();
		this._mfeComponentRef?.destroy();
		this._vcr.clear();
	}
}

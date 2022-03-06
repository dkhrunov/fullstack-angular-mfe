import {
	AfterViewInit,
	ChangeDetectorRef,
	Compiler,
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	Directive,
	Inject,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	TemplateRef,
	Type,
	ViewContainerRef,
} from '@angular/core';
import { EChangesStrategy, OutsideZone, TrackChanges } from '@nx-mfe/client/common';
import { lastValueFrom } from 'rxjs';

// FIXME не динамично для либы
import { DefaultMfeOutletFallbackComponent } from '../components';
import { IMfeModuleRootOptions } from '../interfaces';
import { loadMfeComponent, loadMfeModule } from '../loaders';
import { DynamicComponentBinding, MfeComponentsCache } from '../services';
import { OPTIONS } from '../tokens';
import { MfeInputs, MfeOutputs } from '../types';

export interface LoadedMfe<TModule = unknown, TComponent = unknown> {
	module: Type<TModule>;
	component: Type<TComponent>;
}

const delay = <T>(time: number) => {
	return (result: T) => {
		return new Promise<T>((resolve) => setTimeout(() => resolve(result), time));
	};
};

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
	providers: [DynamicComponentBinding],
})
export class MfeOutletDirective implements OnChanges, AfterViewInit, OnDestroy {
	@Input('mfeOutlet')
	public mfe: string;

	@Input('mfeOutletInputs')
	public inputs?: MfeInputs;

	@Input('mfeOutletOutputs')
	public outputs?: MfeOutputs;

	@Input('mfeOutletInjector')
	public injector?: Injector;

	// TODO mfe string + validation of string
	@Input('mfeOutletLoader')
	public loader?: TemplateRef<void>;

	@Input('mfeOutletLoaderDelay')
	public loaderDelay = this._options.loaderDelay ?? 0;

	// TODO mfe string + validation of string
	@Input('mfeOutletFallback')
	public fallback?: TemplateRef<void>;

	private _mfeComponentFactory?: ComponentFactory<unknown>;
	private _mfeComponentRef?: ComponentRef<unknown>;
	private _loaderComponentRef?: ComponentRef<unknown>;
	private _fallbackComponentRef?: ComponentRef<unknown>;

	constructor(
		private readonly _vcr: ViewContainerRef,
		private readonly _cfr: ComponentFactoryResolver,
		private readonly _compiler: Compiler,
		private readonly _injector: Injector,
		private readonly _cache: MfeComponentsCache,
		private readonly _binding: DynamicComponentBinding,
		@Inject(OPTIONS) private readonly _options: IMfeModuleRootOptions
	) {}

	@TrackChanges('mfe', '_renderMfe', { strategy: EChangesStrategy.NonFirst })
	@TrackChanges('inputs', '_rebindInputs', {
		strategy: EChangesStrategy.NonFirst,
		compare: true,
	})
	public ngOnChanges(): void {
		return;
	}

	public ngOnDestroy(): void {
		this._destroyDisplayedComponent();
	}

	public ngAfterViewInit(): void {
		this._renderMfe();
	}

	/**
	 * Rebind MfeInputs of micro-frontend component.
	 *
	 * Used when changing input "inputs" of this directive.
	 * @internal
	 */
	protected _rebindInputs(): void {
		if (!this._mfeComponentRef || !this._mfeComponentFactory) return;

		this._binding.validateInputs(
			this._mfeComponentFactory.inputs,
			this.inputs ?? {},
			this._mfeComponentRef?.instance
		);
		this._binding.bindInputs(
			this._mfeComponentFactory.inputs,
			this.inputs ?? {},
			this._mfeComponentRef?.instance
		);

		// Workaround for bug related to Angular and dynamic components.
		// Link - https://github.com/angular/angular/issues/36667#issuecomment-926526405
		this._mfeComponentRef?.injector.get(ChangeDetectorRef).detectChanges();
	}

	/**
	 * Rerender micro-frontend component.
	 *
	 * While loading bundle of micro-frontend showing loader.
	 * If error occur then showing fallback.
	 *
	 * Used when changing input "mfe" of this directive.
	 * @internal
	 */
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

				const { module, component } = await this._loadMfe(this.mfe).then(
					delay(this.loaderDelay)
				);
				this._mfeComponentFactory = await this._resolveMfeComponentFactory(
					module,
					component
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

	/**
	 * Load bundle of micro-fronted.
	 * @internal
	 */
	@OutsideZone()
	private async _loadMfe<TModule = unknown, TComponent = unknown>(
		mfe: string
	): Promise<LoadedMfe<TModule, TComponent>> {
		const module = await loadMfeModule<TModule>(mfe);
		const component = await loadMfeComponent<TComponent>(mfe);

		return { module, component };
	}

	/**
	 * Compile micro-frontend module and resolve component factory.
	 * @internal
	 */
	private async _resolveMfeComponentFactory(
		Module: Type<unknown>,
		Component: Type<unknown>
	): Promise<ComponentFactory<unknown>> {
		const moduleFactory = await this._compiler.compileModuleAsync(Module);
		const moduleRef = moduleFactory.create(this.injector ?? this._injector);

		return moduleRef.componentFactoryResolver.resolveComponentFactory(Component);
	}

	/**
	 * Show micro-frontend component.
	 * @param componentFactory Factory of micro-frontend component.
	 * @internal
	 */
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

	/**
	 * Show loader.
	 * @internal
	 */
	private async _showLoader(): Promise<void> {
		this._vcr.clear();

		if (this.loader) {
			this._vcr.createEmbeddedView(this.loader);
		} else if (this._options.loaderMfe) {
			// TODO сделать так чтобы не дублировать код (не работает!!!!) Мб создать сервис
			try {
				if (this._cache.isMfeRegistered(this._options.loaderMfe)) {
					const loaderFactory = await lastValueFrom(
						this._cache.getValue(this._options.loaderMfe)
					);
					const loaderRef = this._vcr.createComponent(loaderFactory);
					loaderRef.changeDetectorRef.detectChanges();
					this._loaderComponentRef = loaderRef;
				} else {
					this._cache.registerMfe(this._options.loaderMfe);

					const { module, component } = await this._loadMfe(this._options.loaderMfe);
					const loaderFactory = await this._resolveMfeComponentFactory(module, component);

					this._cache.setValue(this._options.loaderMfe, loaderFactory);

					const loaderRef = this._vcr.createComponent(loaderFactory);
					loaderRef.changeDetectorRef.detectChanges();
					this._loaderComponentRef = loaderRef;
				}
			} catch (e) {
				console.error(e);

				if (this._cache.isMfeRegistered(this._options.loaderMfe)) {
					this._cache.setError(this._options.loaderMfe, e);
				}
			}
		}
	}

	/**
	 * Show fallback.
	 * @internal
	 */
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

	/**
	 * Bind micro-frontend MfeInputs and MfeOutputs properties.
	 * @internal
	 */
	private _bindMfeComponent(): void {
		if (!this._mfeComponentRef) {
			throw new Error(`ComponentRef of micro-frontend '${this.mfe}' dont exist`);
		}

		if (!this._mfeComponentFactory) {
			throw new Error(`ComponentFactory of micro-frontend '${this.mfe}' dont exist`);
		}

		this._binding.validateInputs(
			this._mfeComponentFactory.inputs,
			this.inputs ?? {},
			this._mfeComponentRef?.instance
		);
		this._binding.validateOutputs(
			this._mfeComponentFactory.outputs,
			this.outputs ?? {},
			this._mfeComponentRef?.instance
		);

		this._binding.bindInputs(
			this._mfeComponentFactory.inputs,
			this.inputs ?? {},
			this._mfeComponentRef?.instance
		);
		this._binding.bindOutputs(
			this._mfeComponentFactory.outputs,
			this.outputs ?? {},
			this._mfeComponentRef?.instance
		);

		// Workaround for bug related to Angular and dynamic components.
		// Link - https://github.com/angular/angular/issues/36667#issuecomment-926526405
		this._mfeComponentRef?.injector.get(ChangeDetectorRef).detectChanges();
	}

	/**
	 * Destroy all displayed components.
	 * @internal
	 */
	private _destroyDisplayedComponent() {
		this._loaderComponentRef?.destroy();
		this._fallbackComponentRef?.destroy();
		this._mfeComponentRef?.destroy();
		this._vcr.clear();
	}
}

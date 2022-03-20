import {
	AfterViewInit,
	ChangeDetectorRef,
	ComponentFactory,
	ComponentRef,
	Directive,
	Inject,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { EChangesStrategy, TrackChanges } from '@nx-mfe/client/common';

import { validateMfeString } from '../helpers';
import { IMfeModuleRootOptions } from '../interfaces';
import { DynamicComponentBinding, MfeComponentsCache, MfeService } from '../services';
import { OPTIONS } from '../tokens';
import { MfeOutletInputs, MfeOutletOutputs } from '../types';

const delay = <T>(time: number) => new Promise<T>((resolve) => setTimeout(resolve, time));

/**
 * Micro-frontend directive for plugin-based approach.
 * -------------
 *
 * This directive allows you to load micro-frontend inside in HTML template.
 *
 * @example
 * <!-- Loads entry component from dashboard micro-frontend app. -->
 * <ng-container *mfeOutlet="'dashboard-mfe/entry'"></ng-container>
 *
 * @example
 * <!--
 *   Loads micro-frontend named - entry from dashboard app with custom loader and custom fallback.
 *   And set input text to micro-frontend component.
 * -->
 * <ng-container *mfeOutlet="
 *     'dashboard/entry';
 *     inputs: { text: text$ | async };
 *     loader: loader;
 *     fallback: fallback
 * ">
 * </ng-container>
 *
 * <ng-template #loader><div>loading...</div></ng-template>
 * <ng-template #fallback><div>ops! Something went wrong</div></ng-template>
 *
 * @example
 * <!--
 *    Loads micro-frontend named - entry from dashboard app with
 *    custom fallback specified as micro-frontend component too.
 * -->
 * <ng-container *mfeOutlet="
 *     'client-dashboard-mfe/entry';
 *     fallback: 'fallback-mfe/default'
 * ">
 * </ng-container>
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[mfeOutlet]',
	exportAs: 'mfeOutlet',
	providers: [DynamicComponentBinding],
})
export class MfeOutletDirective implements OnChanges, AfterViewInit, OnDestroy {
	/**
	 * Micro-frontend string. First half it is app name (remote app)
	 * and second half after slash '/' symbol it is name of exposed component.
	 *
	 * **Notice**
	 *
	 * From micro-frontend app should be exposed both module class and component class.
	 *
	 * @example
	 * // loader-mfe - it is app name
	 * // spinner - exposed component.
	 * // From loader-mfe should be exposed SpinnerComponent and SpinnerModule.
	 * 'loaded-mfe/spinner'
	 */
	@Input('mfeOutlet')
	public mfe: string;

	/**
	 * A map of Inputs for a micro-frontend component.
	 */
	@Input('mfeOutletInputs')
	public inputs?: MfeOutletInputs;

	/**
	 * A map of Outputs for a micro-frontend component.
	 */
	@Input('mfeOutletOutputs')
	public outputs?: MfeOutletOutputs;

	/**
	 * Custom injector for micro-frontend component.
	 *
	 * @default current injector
	 */
	@Input('mfeOutletInjector')
	public injector?: Injector = this._injector;

	/**
	 * TemplateRef or micro-frontend string this content shows
	 * when loading and compiling micro-frontend component.
	 *
	 * **Overrides the loader specified in the global library settings.**
	 *
	 * @default options.loader
	 */
	@Input('mfeOutletLoader')
	public loader?: TemplateRef<unknown> | string = this._options.loader;

	/**
	 * The delay between displaying the contents of the bootloader and the micro-frontend .
	 *
	 * This is to avoid flickering when the micro-frontend loads very quickly.
	 *
	 * @default options.delay, if not set, then 0
	 */
	@Input('mfeOutletLoaderDelay')
	public loaderDelay = this._options.delay ?? 0;

	/**
	 * TemplateRef or micro-frontend string this content shows
	 * when error occur in the loading and the compiling process micro-frontend component.
	 *
	 * **Overrides fallback the specified in the global library settings.**
	 *
	 * @default options.fallback
	 */
	@Input('mfeOutletFallback')
	public fallback?: TemplateRef<unknown> | string = this._options.fallback;

	private _mfeComponentFactory?: ComponentFactory<unknown>;
	private _mfeComponentRef?: ComponentRef<unknown>;
	private _loaderComponentRef?: ComponentRef<unknown>;
	private _fallbackComponentRef?: ComponentRef<unknown>;

	constructor(
		private readonly _vcr: ViewContainerRef,
		private readonly _injector: Injector,
		private readonly _cache: MfeComponentsCache,
		private readonly _mfeService: MfeService,
		private readonly _binding: DynamicComponentBinding,
		@Inject(OPTIONS) private readonly _options: IMfeModuleRootOptions
	) {}

	@TrackChanges('mfe', 'validateMfe', { compare: true })
	@TrackChanges('loader', 'validateLoader', { compare: true })
	@TrackChanges('fallback', 'validateFallback', { compare: true })
	@TrackChanges('mfe', 'render', { strategy: EChangesStrategy.NonFirst })
	@TrackChanges('inputs', 'dataBound', {
		strategy: EChangesStrategy.NonFirst,
		compare: true,
	})
	public ngOnChanges(): void {
		return;
	}

	public ngOnDestroy(): void {
		this._clear();
	}

	public ngAfterViewInit(): void {
		this.render();
	}

	/**
	 * Checks that value of directive is correct micro-frontend string.
	 *
	 * @param value Value
	 *
	 * @internal
	 */
	protected validateMfe(value: string): void {
		validateMfeString(value);
	}

	/**
	 * Checks that value of loader Input is correct micro-frontend string.
	 *
	 * @param value Value
	 *
	 * @internal
	 */
	protected validateLoader(value: TemplateRef<unknown> | string): void {
		if (typeof value === 'string') {
			validateMfeString(value);
		}
	}

	/**
	 * Checks that value  of fallback Input is correct micro-frontend string.
	 *
	 * @param value Value
	 *
	 * @internal
	 */
	protected validateFallback(value: TemplateRef<unknown> | string): void {
		if (typeof value === 'string') {
			validateMfeString(value);
		}
	}

	/**
	 * Rebind MfeOutletInputs of micro-frontend component.
	 *
	 * Used when changing input "inputs" of this directive.
	 *
	 * @internal
	 */
	protected dataBound(): void {
		if (!this._mfeComponentRef || !this._mfeComponentFactory) return;

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
	 *
	 * @internal
	 */
	protected async render(): Promise<void> {
		try {
			// If some component already rendered then need to unbind outputs
			if (this._mfeComponentFactory) this._binding.unbindOutputs();

			if (!this._cache.isRegistered(this.mfe)) {
				await this._showLoader();
				await delay(this.loaderDelay);
			}

			await this._showMfe();

			this._initDataBound();
		} catch (e) {
			console.error(e);
			await this._showFallback();
		}
	}

	/**
	 * Shows micro-frontend component.
	 *
	 * @internal
	 */
	private async _showMfe(): Promise<void> {
		this._clear();

		const { componentFactory, componentRef } = await this._createMfeComponent(this.mfe);
		this._mfeComponentFactory = componentFactory;
		this._mfeComponentRef = componentRef;
	}

	/**
	 * Shows loader content.
	 *
	 * @internal
	 */
	private async _showLoader(): Promise<void> {
		this._clear();

		if (this.loader instanceof TemplateRef) {
			this._vcr.createEmbeddedView(this.loader);
		} else if (this.loader) {
			const { componentRef } = await this._createMfeComponent(this.loader);
			this._loaderComponentRef = componentRef;
		}
	}

	/**
	 * Shows fallback content.
	 *
	 * @internal
	 */
	private async _showFallback(): Promise<void> {
		this._clear();

		if (this.fallback instanceof TemplateRef) {
			this._vcr.createEmbeddedView(this.fallback);
		} else if (this.fallback) {
			const { componentRef } = await this._createMfeComponent(this.fallback);
			this._fallbackComponentRef = componentRef;
		}
	}

	/**
	 * Creates component of the micro-frontend in the viewContainer.
	 *
	 * @param mfe Micro-frontend string
	 *
	 * @internal
	 */
	private async _createMfeComponent<TModule = unknown, TComponent = unknown>(
		mfe: string
	): Promise<{
		componentFactory: ComponentFactory<TComponent>;
		componentRef: ComponentRef<TComponent>;
	}> {
		const componentFactory = await this._mfeService.resolveComponentFactory<
			TModule,
			TComponent
		>(mfe, this.injector);
		const componentRef = this._vcr.createComponent(componentFactory, undefined, this.injector);
		componentRef.changeDetectorRef.detectChanges();

		return { componentFactory, componentRef };
	}

	/**
	 * Binding the initial data of the micro-frontend.
	 *
	 * @internal
	 */
	private _initDataBound(): void {
		if (!this._mfeComponentRef) {
			throw new Error(`ComponentRef of micro-frontend '${this.mfe}' dont exist`);
		}

		if (!this._mfeComponentFactory) {
			throw new Error(`ComponentFactory of micro-frontend '${this.mfe}' dont exist`);
		}

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
	 *
	 * @internal
	 */
	private _clear() {
		this._loaderComponentRef?.destroy();
		this._fallbackComponentRef?.destroy();
		this._mfeComponentRef?.destroy();
		this._vcr.clear();
	}
}

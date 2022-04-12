import {
	AfterViewInit,
	ChangeDetectorRef,
	ComponentFactory,
	ComponentRef,
	Directive,
	EmbeddedViewRef,
	Inject,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	TemplateRef,
	Type,
	ViewContainerRef,
} from '@angular/core';
import { EChangesStrategy, TrackChanges } from '@nx-mfe/client/common';
import { validateMfeString } from '../helpers';
import { IMfeModuleRootOptions } from '../interfaces';
import {
	DynamicComponentBinding,
	MfeComponentFactoryResolver,
	MfeComponentFactoryResolverOptions,
	MfeComponentsCache,
} from '../services';
import { OPTIONS } from '../tokens';
import { MfeOutletInputs, MfeOutletOutputs } from '../types';

const delay = <T>(time: number) => new Promise<T>((resolve) => setTimeout(resolve, time));

type CreationElement = string | TemplateRef<unknown> | Type<unknown>;

type CreatedElementRef = EmbeddedViewRef<unknown> | ComponentRef<unknown>;

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
	 * The delay between displaying the contents of the bootloader and the micro-frontend .
	 *
	 * This is to avoid flickering when the micro-frontend loads very quickly.
	 *
	 * @default options.delay, if not set, then 0
	 */
	@Input('mfeOutletLoaderDelay')
	public loaderDelay = this._options.delay ?? 0;

	/**
	 * TemplateRef or MFE string or TemplateRef or Component class.
	 * Displayed when loading the micro-frontend.
	 *
	 * **Overrides the loader specified in the global library settings.**
	 *
	 * @default options.loader
	 */
	@Input('mfeOutletLoader')
	public loader?: CreationElement = this._options.loader;

	/**
	 * TemplateRef or MFE string or TemplateRef or Component class.
	 * Displayed when loading or compiling a micro-frontend with an error.
	 *
	 * **Overrides fallback the specified in the global library settings.**
	 *
	 * @default options.fallback
	 */
	@Input('mfeOutletFallback')
	public fallback?: CreationElement = this._options.fallback;

	/**
	 * Custom options for MfeComponentFactoryResolver.
	 */
	@Input('mfeOutletOptions')
	public options?: MfeComponentFactoryResolverOptions;

	private _mfeComponentFactory?: ComponentFactory<unknown>;
	private _mfeComponentRef?: ComponentRef<unknown>;
	private _loaderComponentRef?: ComponentRef<unknown> | EmbeddedViewRef<unknown>;
	private _fallbackComponentRef?: ComponentRef<unknown> | EmbeddedViewRef<unknown>;

	constructor(
		private readonly _vcr: ViewContainerRef,
		private readonly _injector: Injector,
		private readonly _cache: MfeComponentsCache,
		private readonly _mcfr: MfeComponentFactoryResolver,
		private readonly _binding: DynamicComponentBinding,
		@Inject(OPTIONS) private readonly _options: IMfeModuleRootOptions
	) {}

	@TrackChanges('mfe', 'render', {
		compare: true,
		strategy: EChangesStrategy.NonFirst,
	})
	@TrackChanges('inputs', 'transferInputs', {
		strategy: EChangesStrategy.NonFirst,
		compare: true,
	})
	@TrackChanges('mfe', 'validateMfeString', { compare: true })
	@TrackChanges('loader', 'validateMfeString', { compare: true })
	@TrackChanges('fallback', 'validateMfeString', { compare: true })
	public ngOnChanges(): void {
		return;
	}

	public ngOnDestroy(): void {
		this._clearView();
	}

	public ngAfterViewInit(): void {
		this.render();
	}

	/**
	 * Checks that value of Input is correct micro-frontend string.
	 *
	 * @param value Setted value
	 *
	 * @internal
	 */
	protected validateMfeString(value: string | undefined): void {
		if (typeof value === 'string') {
			validateMfeString(value);
		}
	}

	/**
	 * Transfer MfeOutletInputs to micro-frontend component.
	 *
	 * Used when changing input "inputs" of this directive.
	 *
	 * @internal
	 */
	protected transferInputs(): void {
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

			if (this._cache.isRegistered(this.mfe)) {
				this._showMfe();
			} else {
				await this._showLoader();
				await delay(this.loaderDelay);
				this._showMfe();
			}
		} catch (error) {
			console.error(error);
			this._showFallback();
		}
	}

	/**
	 * Shows micro-frontend component.
	 *
	 * @internal
	 */
	private async _showMfe(): Promise<void> {
		try {
			if (this.mfe) {
				this._mfeComponentRef = await this._displayComponent(this.mfe, true, this.options);
				this._bindMfeData();
			}
		} catch (error) {
			console.error(error);
			this._showFallback();
		}
	}

	/**
	 * Shows loader content.
	 *
	 * @internal
	 */
	private async _showLoader(): Promise<void> {
		try {
			if (this.loader) {
				this._loaderComponentRef = await this._displayComponent(this.loader);
			}
		} catch (error) {
			console.error(error);
			this._showFallback();
		}
	}

	/**
	 * Shows fallback content.
	 *
	 * @internal
	 */
	private async _showFallback(): Promise<void> {
		if (this.fallback) {
			this._fallbackComponentRef = await this._displayComponent(this.fallback);
		}
	}

	/**
	 * Shows MFE | TemlateRer | Component content.
	 *
	 * @param templateRefOrMfeString MFE string or TemlateRef or Component.
	 * @param saveComponentFactory If true saves componentFactory to this._mfeComponentFactory property.
	 * @param options Custom options for MfeComponentFactoryResolver.
	 *
	 * @internal
	 */
	private async _displayComponent<TComponent = unknown>(
		mfeString: string,
		saveComponentFactory?: boolean,
		options?: MfeComponentFactoryResolverOptions
	): Promise<ComponentRef<TComponent>>;
	private async _displayComponent<TContext = unknown>(
		templateRef: TemplateRef<TContext>
	): Promise<EmbeddedViewRef<TContext>>;
	private async _displayComponent<TComponent = unknown>(
		component: Type<TComponent>
	): Promise<ComponentRef<TComponent>>;
	private async _displayComponent<TComponent = unknown>(
		content: CreationElement,
		saveComponentFactory?: boolean,
		options?: MfeComponentFactoryResolverOptions
	): Promise<CreatedElementRef>;
	private async _displayComponent<TComponent = unknown>(
		content: CreationElement,
		saveComponentFactory: boolean = false,
		options?: MfeComponentFactoryResolverOptions
	): Promise<CreatedElementRef> {
		// MFE
		if (typeof content === 'string') {
			const componentFactory = await this._mcfr.resolveComponentFactory<TComponent>(
				content,
				this.injector,
				options
			);

			if (saveComponentFactory) {
				this._mfeComponentFactory = componentFactory;
			}

			this._clearView();

			const componentRef = this._vcr.createComponent(
				componentFactory,
				undefined,
				this.injector
			);
			componentRef.changeDetectorRef.detectChanges();
			return componentRef;
		}
		// TemplateRef
		else if (content instanceof TemplateRef) {
			this._clearView();

			return this._vcr.createEmbeddedView(content);
		}
		// Component
		else {
			this._clearView();

			return this._vcr.createComponent(content, { injector: this.injector });
		}
	}

	/**
	 * Binding the initial data of the micro-frontend.
	 *
	 * @internal
	 */
	private _bindMfeData(): void {
		if (!this._mfeComponentRef || !this._mfeComponentFactory) {
			throw new Error(
				`_bindMfeData method must be called after micro-frontend component "${this.mfe}" has been initialized.`
			);
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
	private _clearView() {
		this._loaderComponentRef?.destroy();
		this._fallbackComponentRef?.destroy();
		this._mfeComponentRef?.destroy();
		this._vcr.clear();
	}
}

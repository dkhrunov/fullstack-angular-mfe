import {
	AfterViewInit,
	ChangeDetectorRef,
	ComponentRef,
	Directive,
	EmbeddedViewRef,
	Inject,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { EChangesStrategy, TrackChanges } from '@nx-mfe/client/common';

import { LoadMfeOptions } from '../helpers';
import {
	IMfeModuleOptions,
	isStandaloneRemoteComponent,
	ModularRemoteComponent,
	RemoteComponent,
	StandaloneRemoteComponent,
} from '../interfaces';
import { DynamicComponentBinding, MfeComponentsCache, MfeService } from '../services';
import { OPTIONS } from '../tokens';
import { MfeOutletInputs, MfeOutletOutputs } from '../types';

const delay = <T>(time: number) => new Promise<T>((resolve) => setTimeout(resolve, time));

/**
 * Micro-frontend directive for plugin-based approach.
 * -------------
 *
 * This directive give you to load micro-frontend inside in HTML template.
 *
 * @example Loads remote component and show as embed view or as a plugin.
 * ```html
 * <!-- Loads EntryComponent that declared in EntryModule from dashboard micro-frontend app. -->
 * <ng-container *mfeOutlet="
 *    'dashboard';
 *    module: 'EntryModule';
 *    component: 'EntryComponent';
 * ">
 * </ng-container>
 *
 * <!-- Or you can use ng-template, next example works same as previous example -->
 * <ng-template
 *    mfeOutlet="dashboard"
 *    mfeOutletModule="EntryModule"
 *    mfeOutletComponent="EntryComponent"
 * >
 * </ng-template>
 * ```
 *
 * @example Loads standalone remote component. Standalone component - it is a component that does not depend on anything and does not need dependencies from other modules.
 * ```html
 * <!-- You can load a standalone component without declaring a module in the mfeOutletModule prop. -->
 * <ng-template
 *    mfeOutlet="dashboard"
 *    mfeOutletComponent="EntryComponent"
 * >
 * </ng-template>
 * ```
 *
 * @example You can sets Inputs and sets handlers for Output events of the Remote component.
 * ```html
 * <ng-container *mfeOutlet="
 *    'dashboard';
 *    module: 'EntryModule';
 *    component: 'EntryComponent';
 *    inputs: { text: text$ | async };
 *    outputs: { click: onClick }
 * ">
 * </ng-container>
 *```
 *
 * @example Loads remote component and sets custom loader, same approach for fallback view.
 * ```html
 * <ng-template
 *    mfeOutlet="dashboard"
 *    mfeOutletModule="EntryModule"
 *    mfeOutletComponent="EntryComponent"
 *    [mfeOutletLoader]="loaderMfe"
 *    [mfeOutletLoaderDelay]="2000"
 * >
 * </ng-template>
 *
 * <!-- You can specify simple HTML content or declare another MFE component, like in the example below. -->
 * <ng-template #loaderMfe>
 *    <!-- For loader Mfe you should set mfeOutletLoader to undefined, and mfeOutletLoaderDelay to 0. For better UX. -->
 *    <ng-template
 *      mfeOutlet="loaders"
 *      mfeOutletModule="SpinnerModule"
 *      mfeOutletComponent="SpinnerComponent"
 *      [mfeOutletLoader]="undefined"
 *      [mfeOutletLoaderDelay]="0"
 *    >
 *    </ng-template>
 * </ng-template>
 *
 * <!-- Simple HTML content. -->
 * <ng-template #loader>
 *    <div>loading...</div>
 * </ng-template>
 * ```
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[mfeOutlet]',
	exportAs: 'mfeOutlet',
	providers: [DynamicComponentBinding],
})
export class MfeOutletDirective implements OnChanges, AfterViewInit, OnDestroy {
	/**
	 * Sets the Remote app name.
	 */
	@Input('mfeOutlet')
	public mfeApp?: string;

	/**
	 * Sets the Remote compoennt.
	 */
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input('mfeOutletComponent')
	public mfeComponent?: string;

	/**
	 * Sets the Remote module where declared Remote component (```mfeOutletComponent```)
	 */
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input('mfeOutletModule')
	public mfeModule?: string;

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
	 * @default current injector
	 */
	@Input('mfeOutletInjector')
	public injector?: Injector = this._injector;

	/**
	 * MFE RemoteComponent or TemplateRef.
	 * Displayed when loading the micro-frontend.
	 *
	 * **Overrides the loader specified in the global library settings.**
	 * @default options.loader
	 */
	@Input('mfeOutletLoader')
	public set loader(value: TemplateRef<unknown> | undefined) {
		this._loader = value;
	}

	/**
	 * The delay between displaying the contents of the bootloader and the micro-frontend .
	 *
	 * This is to avoid flickering when the micro-frontend loads very quickly.
	 *
	 * @default options.delay, if not set, then 0
	 */
	@Input('mfeOutletLoaderDelay')
	public loaderDelay = this._options.loaderDelay ?? 0;

	/**
	 * MFE RemoteComponent or TemplateRef.
	 * Displayed when loaded or compiled a micro-frontend with an error.
	 *
	 * **Overrides fallback the specified in the global library settings.**
	 * @default options.fallback
	 */
	@Input('mfeOutletFallback')
	public set fallback(value: TemplateRef<unknown> | undefined) {
		this._fallback = value;
	}

	/**
	 * Custom options for loading Mfe.
	 */
	@Input('mfeOutletOptions')
	public options?: LoadMfeOptions;

	private _loader?: RemoteComponent | TemplateRef<unknown> = this._options.loader;
	private _fallback?: RemoteComponent | TemplateRef<unknown> = this._options.fallback;

	private _mfeComponentRef?: ComponentRef<unknown>;
	private _loaderComponentRef?: ComponentRef<unknown> | EmbeddedViewRef<unknown>;
	private _fallbackComponentRef?: ComponentRef<unknown> | EmbeddedViewRef<unknown>;

	/**
	 * Remote component object.
	 */
	private get _remoteComponent(): RemoteComponent {
		if (this.mfeModule) {
			return {
				app: this.mfeApp,
				component: this.mfeComponent,
				module: this.mfeModule,
			} as ModularRemoteComponent;
		}

		return {
			app: this.mfeApp,
			component: this.mfeComponent,
		} as StandaloneRemoteComponent;
	}

	constructor(
		private readonly _vcr: ViewContainerRef,
		private readonly _injector: Injector,
		private readonly _mfeCache: MfeComponentsCache,
		private readonly _mfeService: MfeService,
		private readonly _dynamicBinding: DynamicComponentBinding,
		@Inject(OPTIONS) private readonly _options: IMfeModuleOptions
	) {}

	@TrackChanges('mfeRemote', 'renderMfe', {
		compare: true,
		strategy: EChangesStrategy.NonFirst,
	})
	@TrackChanges('mfeComponent', 'renderMfe', {
		compare: true,
		strategy: EChangesStrategy.NonFirst,
	})
	@TrackChanges('mfeModule', 'renderMfe', {
		compare: true,
		strategy: EChangesStrategy.NonFirst,
	})
	@TrackChanges('inputs', 'transferInputs', {
		strategy: EChangesStrategy.NonFirst,
		compare: true,
	})
	public ngOnChanges(): void {
		return;
	}

	public ngAfterViewInit(): void {
		this.renderMfe();
	}

	public ngOnDestroy(): void {
		this._clearView();
	}

	/**
	 * Transfer MfeOutletInputs to micro-frontend component.
	 *
	 * Used when changing input "inputs" of this directive.
	 * @internal
	 */
	protected transferInputs(): void {
		if (!this._mfeComponentRef) return;

		this._dynamicBinding.bindInputs(this._mfeComponentRef, this.inputs ?? {});

		// Workaround for bug related to Angular and dynamic components.
		// Link - https://github.com/angular/angular/issues/36667#issuecomment-926526405
		this._mfeComponentRef?.injector.get(ChangeDetectorRef).detectChanges();
	}

	/**
	 * Render micro-frontend component.
	 *
	 * While loading bundle of micro-frontend showing loader.
	 * If error occur then showing fallback.
	 *
	 * Used when changing input "mfe" of this directive.
	 * @internal
	 */
	protected async renderMfe(): Promise<void> {
		try {
			// If some component already rendered then need to unbind outputs
			if (this._mfeComponentRef) this._dynamicBinding.unbindOutputs();

			if (this._mfeCache.isRegistered(this._remoteComponent)) {
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
	 * @internal
	 */
	private async _showMfe(): Promise<void> {
		try {
			if (this.mfeApp) {
				this._mfeComponentRef = await this._createView(this._remoteComponent, this.options);
				this._bindMfeData();
			}
		} catch (error) {
			console.error(error);
			this._showFallback();
		}
	}

	/**
	 * Shows loader content.
	 * @internal
	 */
	private async _showLoader(): Promise<void> {
		try {
			if (this._loader) {
				this._loaderComponentRef = await this._createView(this._loader);
			}
		} catch (error) {
			console.error(error);
			this._showFallback();
		}
	}

	/**
	 * Shows fallback content.
	 * @internal
	 */
	private async _showFallback(): Promise<void> {
		if (this._fallback) {
			this._fallbackComponentRef = await this._createView(this._fallback);
		}
	}

	/**
	 * Shows MFE Component or TemlateRef.
	 * @param content MFE (Remote component) or TemlateRef.
	 * @param options Custom options for MfeComponentFactoryResolver.
	 * @internal
	 */
	private async _createView<TContext = unknown>(
		templateRef: TemplateRef<TContext>
	): Promise<EmbeddedViewRef<TContext>>;

	private async _createView<TComponent = unknown>(
		remoteComponent: RemoteComponent,
		options?: LoadMfeOptions
	): Promise<ComponentRef<TComponent>>;

	private async _createView<T = unknown>(
		remoteComponentOrTemplateRef: RemoteComponent | TemplateRef<T>,
		options?: LoadMfeOptions
	): Promise<EmbeddedViewRef<T> | ComponentRef<T>>;

	private async _createView<T = unknown>(
		content: RemoteComponent | TemplateRef<T>,
		options?: LoadMfeOptions
	): Promise<EmbeddedViewRef<T> | ComponentRef<T>> {
		// TemplateRef
		if (content instanceof TemplateRef) {
			this._clearView();
			return this._vcr.createEmbeddedView<T>(content);
		}
		// MFE (Remote Component)
		else {
			const componentRef: ComponentRef<T> = isStandaloneRemoteComponent(content)
				? // for Angular v13+
				  await this._createStandaloneRemoteComponent(content, options)
				: // for Angular under v13 with componentFactory
				  await this._createModularRemoteComponent(content, options);

			componentRef.changeDetectorRef.detectChanges();
			return componentRef;
		}
	}

	/**
	 * Create view for standalone remote component.
	 * @param remoteComponent MFE remote component
	 * @param options (Optional) object of options.
	 */
	private async _createStandaloneRemoteComponent<TComponent>(
		remoteComponent: StandaloneRemoteComponent,
		options?: LoadMfeOptions
	): Promise<ComponentRef<TComponent>> {
		const componentType = await this._mfeService.loadStandaloneComponent<TComponent>(
			remoteComponent,
			options
		);

		this._clearView();

		const componentRef = this._vcr.createComponent<TComponent>(componentType, {
			injector: this.injector,
		});

		return componentRef;
	}

	/**
	 * Create view for modular remote component.
	 * @param remoteComponent MFE remote component
	 * @param options (Optional) object of options.
	 */
	private async _createModularRemoteComponent<TComponent>(
		remoteComponent: ModularRemoteComponent,
		options?: LoadMfeOptions
	): Promise<ComponentRef<TComponent>> {
		const componentFactory = await this._mfeService.loadModularComponent<unknown, TComponent>(
			remoteComponent,
			this._injector,
			options
		);

		this._clearView();

		const componentRef = this._vcr.createComponent<TComponent>(
			componentFactory,
			undefined,
			this.injector
		);

		return componentRef;
	}

	/**
	 * Binding the initial data of the micro-frontend.
	 * @internal
	 */
	private _bindMfeData(): void {
		if (!this._mfeComponentRef) {
			throw new Error(
				`_bindMfeData method must be called after micro-frontend component "${this.mfeApp}" has been initialized.`
			);
		}

		this._dynamicBinding.bindInputs(this._mfeComponentRef, this.inputs ?? {});
		this._dynamicBinding.bindOutputs(this._mfeComponentRef, this.outputs ?? {});

		// Workaround for bug related to Angular and dynamic components.
		// Link - https://github.com/angular/angular/issues/36667#issuecomment-926526405
		this._mfeComponentRef?.injector.get(ChangeDetectorRef).detectChanges();
	}

	/**
	 * Destroy all displayed components.
	 * @internal
	 */
	private _clearView() {
		this._loaderComponentRef?.destroy();
		this._fallbackComponentRef?.destroy();
		this._mfeComponentRef?.destroy();
		this._vcr.clear();
	}
}

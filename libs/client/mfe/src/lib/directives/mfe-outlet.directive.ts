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
import { MfeInputs, MfeOutputs } from '../types';

const delay = <T>(time: number) => new Promise<T>((resolve) => setTimeout(resolve, time));

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

	/**
	 * @default current injector
	 */
	@Input('mfeOutletInjector')
	public injector?: Injector = this._injector;

	/**
	 * @default options.loader
	 */
	@Input('mfeOutletLoader')
	public loader?: TemplateRef<unknown> | string = this._options.loader;

	@Input('mfeOutletLoaderDelay')
	/**
	 * @default options.delay, if not set, then 0
	 */
	public loaderDelay = this._options.delay ?? 0;

	@Input('mfeOutletFallback')
	/**
	 * @default options.fallback
	 */
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

	protected validateMfe(value: string): void {
		validateMfeString(value);
	}

	protected validateLoader(value: TemplateRef<unknown> | string): void {
		if (typeof value === 'string') {
			validateMfeString(value);
		}
	}

	protected validateFallback(value: TemplateRef<unknown> | string): void {
		if (typeof value === 'string') {
			validateMfeString(value);
		}
	}

	/**
	 * Rebind MfeInputs of micro-frontend component.
	 *
	 * Used when changing input "inputs" of this directive.
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
	 * @internal
	 */
	protected async render(): Promise<void> {
		try {
			if (!this._cache.isMfeRegistered(this.mfe)) {
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

	private async _showMfe(): Promise<void> {
		this._clear();

		const { componentFactory, componentRef } = await this._createMfeComponent(this.mfe);
		this._mfeComponentFactory = componentFactory;
		this._mfeComponentRef = componentRef;
	}

	/**
	 * Show loader.
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
	 * Show fallback.
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

	private async _createMfeComponent<C>(
		mfe: string
	): Promise<{ componentFactory: ComponentFactory<C>; componentRef: ComponentRef<C> }> {
		const componentFactory = await this._mfeService.get<unknown, C>(mfe, this.injector);
		const componentRef = this._vcr.createComponent(componentFactory, undefined, this.injector);
		componentRef.changeDetectorRef.detectChanges();

		return { componentFactory, componentRef };
	}

	/**
	 * Bind micro-frontend MfeInputs and MfeOutputs properties.
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
	 * @internal
	 */
	private _clear() {
		this._loaderComponentRef?.destroy();
		this._fallbackComponentRef?.destroy();
		this._mfeComponentRef?.destroy();
		this._vcr.clear();
	}
}

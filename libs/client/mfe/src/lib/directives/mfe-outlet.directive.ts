import {
	AfterViewInit,
	Compiler,
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	Directive,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	TemplateRef,
	Type,
	ViewContainerRef,
} from '@angular/core';
import { EChangesStrategy, OutsideZone, TrackChanges } from '@nx-mfe/client/common';
import { lastValueFrom, Subject } from 'rxjs';

import { DefaultMfeOutletFallbackComponent, DefaultMfeOutletLoaderComponent } from '../components';
import { loadMfeComponent, loadMfeModule } from '../loaders';
import { MfeComponentsCache } from '../services';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[mfeOutlet]',
	exportAs: 'mfeOutlet',
})
export class MfeOutletDirective implements OnChanges, AfterViewInit, OnDestroy {
	@Input('mfeOutlet')
	public mfe: string;

	@Input('mfeOutletContext')
	public context: Record<string, unknown>;

	@Input('mfeOutletInjector')
	public injector?: Injector;

	@Input('mfeOutletLoader')
	public loader?: TemplateRef<unknown>;

	@Input('mfeOutletLoaderDelay')
	public loaderDelay = 300;

	@Input('mfeOutletFallback')
	public fallback?: TemplateRef<unknown>;

	private readonly _destroy$ = new Subject<void>();

	constructor(
		private readonly _vcr: ViewContainerRef,
		private readonly _cfr: ComponentFactoryResolver,
		private readonly _compiler: Compiler,
		private readonly _injector: Injector,
		private readonly _cache: MfeComponentsCache
	) {}

	@TrackChanges('mfe', '_renderMfe', EChangesStrategy.NonFirst)
	public ngOnChanges(): void {
		return;
	}

	public ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	public ngAfterViewInit(): void {
		this._renderMfe();
	}

	protected async _renderMfe(): Promise<void> {
		try {
			this._showLoader();

			if (this._cache.isMfeRegistered(this.mfe)) {
				// const mfeComponentFactory = await lastValueFrom(
				// 	this._cache.getValue(this.mfe).pipe(
				// 		takeUntil(this._destroy$),
				// 		catchError((e) => {
				// 			this._showFallback();
				// 			return throwError(e);
				// 		})
				// 	)
				// );
				const mfeComponentFactory = await lastValueFrom(this._cache.getValue(this.mfe));

				this._showMfe(mfeComponentFactory);
			} else {
				this._cache.registerMfe(this.mfe);

				const [MfeModule, MfeComponent] = await this._loadMfe();
				const mfeComponentFactory = await this._resolveMfeComponentFactory(
					MfeModule,
					MfeComponent
				);

				this._cache.setValue(this.mfe, mfeComponentFactory);
				this._showMfe(mfeComponentFactory);
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
	private async _loadMfe(): Promise<[Type<unknown>, Type<unknown>]> {
		const mfePromise = loadMfeModule(this.mfe).then(async (Module) => [
			Module,
			await loadMfeComponent(this.mfe),
		]);
		// Delay - anti-flicker
		const loaderDelay = new Promise((resolve) => setTimeout(resolve, this.loaderDelay));

		const [[MfeModule, MfeComponent]] = await Promise.all([mfePromise, loaderDelay]);

		return [MfeModule, MfeComponent];
	}

	private async _resolveMfeComponentFactory(
		Module: Type<unknown>,
		Component: Type<unknown>
	): Promise<ComponentFactory<unknown>> {
		// Difference for Ivy and ViewEngine
		const moduleFactory = await this._compiler.compileModuleAsync(Module);
		const moduleRef = moduleFactory.create(this._injector);

		return moduleRef.componentFactoryResolver.resolveComponentFactory(Component);
	}

	private _showMfe(componentFactory: ComponentFactory<unknown>): ComponentRef<unknown> {
		this._vcr.clear();

		const compRef = this._vcr.createComponent(componentFactory);
		compRef.changeDetectorRef.detectChanges();

		return compRef;
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
		}
	}
}

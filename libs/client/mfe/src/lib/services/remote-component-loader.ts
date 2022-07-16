import { createNgModuleRef, Injectable, Injector, NgZone, Type } from '@angular/core';

import { loadMfe, LoadMfeOptions } from '../helpers';
import { RemoteComponentWithModule, StandaloneRemoteComponent } from '../interfaces';
import { ComponentWithNgModuleRef } from '../types';
import { RemoteComponentsCache } from './remote-components-cache';

/**
 * A low-level service for loading a remote micro-frontend component.
 */
@Injectable({
	providedIn: 'root',
})
export class RemoteComponentLoader {
	constructor(
		private readonly _ngZone: NgZone,
		private readonly _injector: Injector,
		private readonly _cache: RemoteComponentsCache
	) {}

	/**
	 * Loads a remote component with module where was declared this component.
	 * @param remoteComponent Remote component.
	 * @param injector (Optional) Injector, use root injector by default.
	 * @param options (Optional) object of options.
	 */
	public async loadComponentWithModule<TComponent = unknown, TModule = unknown>(
		remoteComponent: RemoteComponentWithModule,
		injector: Injector = this._injector,
		options?: LoadMfeOptions
	): Promise<ComponentWithNgModuleRef<TComponent, TModule>> {
		try {
			if (this._cache.isRegistered(remoteComponent)) {
				return this._cache.getValue<TComponent, TModule>(remoteComponent);
			}

			this._cache.register(remoteComponent);

			const { component, module } = await this._ngZone.runOutsideAngular(async () => {
				const component = await loadMfe<TComponent>(
					remoteComponent.app,
					remoteComponent.component,
					options
				);
				const module = await loadMfe<TModule>(
					remoteComponent.app,
					remoteComponent.module,
					options
				);

				return { component, module };
			});

			const ngModuleRef = createNgModuleRef(module, injector);

			const componentWithNgModuleRef: ComponentWithNgModuleRef<TComponent, TModule> = {
				component,
				ngModuleRef,
			};
			this._cache.setValue<TComponent, TModule>(remoteComponent, componentWithNgModuleRef);
			return componentWithNgModuleRef;
		} catch (error: unknown) {
			this._cache.setError(remoteComponent, error);
			throw error;
		}
	}

	/**
	 * Loads a standalone remote component.
	 * @param remoteComponent Remote component
	 * @param options (Optional) object of options.
	 */
	public async loadStandaloneComponent<C = unknown>(
		remoteComponent: StandaloneRemoteComponent,
		options?: LoadMfeOptions
	): Promise<Type<C>> {
		try {
			if (this._cache.isRegistered(remoteComponent)) {
				return this._cache.getValue<C>(remoteComponent);
			}

			this._cache.register(remoteComponent);

			const componentType = await this._ngZone.runOutsideAngular(() =>
				loadMfe<C>(remoteComponent.app, remoteComponent.component, options)
			);

			this._cache.setValue<C>(remoteComponent, componentType);

			return componentType;
		} catch (error: unknown) {
			this._cache.setError(remoteComponent, error);
			throw error;
		}
	}
}

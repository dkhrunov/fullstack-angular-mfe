import { ComponentFactory, createNgModuleRef, Injectable, Injector, Type } from '@angular/core';

import { loadMfe, LoadMfeOptions } from '../helpers';
import { ModularRemoteComponent, StandaloneRemoteComponent } from '../interfaces';
import { MfeComponentsCache } from './mfe-components-cache.service';

/**
 * A low-level service for loading a remote micro-frontend component.
 */
@Injectable({
	providedIn: 'root',
})
export class MfeService {
	constructor(
		private readonly _injector: Injector,
		private readonly _mfeCache: MfeComponentsCache
	) {}

	/**
	 * Loads MFE component.
	 * @param remoteComponent Remote component.
	 * @param injector (Optional) Injector, use root injector by default.
	 * @param options (Optional) object of options.
	 */
	public async loadModularComponent<TModule = unknown, TComponent = unknown>(
		remoteComponent: ModularRemoteComponent,
		injector: Injector = this._injector,
		options: LoadMfeOptions = { type: 'module' }
	): Promise<ComponentFactory<TComponent>> {
		try {
			if (this._mfeCache.isRegistered(remoteComponent)) {
				return this._mfeCache.getValue<TComponent>(remoteComponent);
			}

			this._mfeCache.register(remoteComponent);

			const moduleType = await loadMfe<TModule>(
				remoteComponent.app,
				remoteComponent.module,
				options
			);
			const componentType = await loadMfe<TComponent>(
				remoteComponent.app,
				remoteComponent.component,
				options
			);

			const moduleRef = createNgModuleRef(moduleType, injector);
			// TODO можно будет избавиться от фабрики и загружать компоненты только как standalone,
			// но тогда в том модуле где создается компонент через директиву придется импортировать все необходимы зависимости/модули.
			const componentFactory =
				moduleRef.componentFactoryResolver.resolveComponentFactory(componentType);

			this._mfeCache.setValue<TComponent>(remoteComponent, componentFactory);

			return componentFactory;
		} catch (error: unknown) {
			this._mfeCache.setError(remoteComponent, error);
			throw error;
		}
	}

	/**
	 * Loads standalone MFE component.
	 * @param remoteComponent Remote component
	 * @param options (Optional) object of options.
	 */
	public async loadStandaloneComponent<TComponent = unknown>(
		remoteComponent: StandaloneRemoteComponent,
		options: LoadMfeOptions = { type: 'module' }
	): Promise<Type<TComponent>> {
		try {
			if (this._mfeCache.isRegistered(remoteComponent)) {
				return this._mfeCache.getValue<TComponent>(remoteComponent);
			}

			this._mfeCache.register(remoteComponent);
			const componentType = await loadMfe<TComponent>(
				remoteComponent.app,
				remoteComponent.component,
				options
			);
			this._mfeCache.setValue<TComponent>(remoteComponent, componentType);

			return componentType;
		} catch (error: unknown) {
			this._mfeCache.setError(remoteComponent, error);
			throw error;
		}
	}
}

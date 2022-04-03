import { Compiler, ComponentFactory, Injectable, Injector, Type } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { loadMfeComponent, loadMfeModule, validateMfeString } from '../helpers';
import { LoadedMfe } from '../interfaces';
import { MfeComponentsCache } from './mfe-components-cache.service';

/**
 * A low-level service for loading a micro-frontend module and a component,
 * or getting component factory.
 */
@Injectable({
	providedIn: 'root',
})
export class MfeService {
	constructor(
		private readonly _compiler: Compiler,
		private readonly _injector: Injector,
		private readonly _cache: MfeComponentsCache
	) {}

	/**
	 * Resolve the micro-frontend component factory.
	 * @param mfe Micro-frontend string
	 * @param injector Custom injector, by default sets current injector.
	 */
	public async resolveComponentFactory<TModule = unknown, TComponent = unknown>(
		mfe: string,
		injector: Injector = this._injector
	): Promise<ComponentFactory<TComponent>> {
		try {
			validateMfeString(mfe);

			if (this._cache.isRegistered(mfe)) {
				return lastValueFrom(this._cache.getValue(mfe));
			}

			this._cache.register(mfe);

			const { ModuleClass, ComponentClass } = await this.load<TModule, TComponent>(mfe);
			const moduleFactory = await this._compiler.compileModuleAsync(ModuleClass);
			const moduleRef = moduleFactory.create(injector);
			const componentFactory =
				moduleRef.componentFactoryResolver.resolveComponentFactory(ComponentClass);

			this._cache.setValue(mfe, componentFactory);

			return componentFactory;
		} catch (error) {
			if (this._cache.isRegistered(mfe)) {
				this._cache.setError(mfe, error);
			}

			throw new Error(error as string);
		}
	}

	/**
	 * Loads the micro-frontend exposed module class and exposed component class.
	 * @param mfe Micro-frontend string
	 */
	public async load<TModule = unknown, TComponent = unknown>(
		mfe: string
	): Promise<LoadedMfe<TModule, TComponent>> {
		validateMfeString(mfe);

		const ModuleClass = await this.loadModule<TModule>(mfe);
		const ComponentClass = await this.loadComponent<TComponent>(mfe);

		return { ModuleClass, ComponentClass };
	}

	/**
	 * Loads an exposed micro-frontend module class.
	 * @param mfe Micro-frontend string
	 */
	public async loadModule<T>(mfe: string): Promise<Type<T>> {
		validateMfeString(mfe);

		return await loadMfeModule<T>(mfe);
	}

	/**
	 * Loads an exposed micro-frontend component class.
	 * @param mfe Micro-frontend string
	 */
	public async loadComponent<T>(mfe: string): Promise<Type<T>> {
		validateMfeString(mfe);

		return await loadMfeComponent<T>(mfe);
	}
}

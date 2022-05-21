import {
	Compiler,
	ComponentFactory,
	Injectable,
	Injector,
	ModuleWithComponentFactories,
	Type,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { loadMfe, LoadMfeOptions, validateMfeString } from '../helpers';
import { MfeComponentsCache } from './mfe-components-cache.service';

export type MfeComponentFactoryResolverOptions = {
	/**
	 * Set custom component name declared in exposed module,
	 * by default component name = exposedItem + 'Component'.
	 */
	componentName?: string;
} & LoadMfeOptions;

/**
 * A low-level service for loading a micro-frontend module and a component,
 * or getting component factory.
 */
@Injectable({
	providedIn: 'root',
})
export class MfeComponentFactoryResolver {
	constructor(
		private readonly _compiler: Compiler,
		private readonly _injector: Injector,
		private readonly _cache: MfeComponentsCache
	) {}

	/**
	 * Resolve the micro-frontend component factory.
	 * @param mfeString micro-frontend string
	 * @param injector custom injector, by default sets current injector.
	 * @param options (Optional) list of options.
	 */
	public async resolveComponentFactory<TModule = unknown, TComponent = unknown>(
		mfeString: string,
		injector: Injector = this._injector,
		options: MfeComponentFactoryResolverOptions = { type: 'module' }
	): Promise<ComponentFactory<TComponent>> {
		try {
			validateMfeString(mfeString);

			if (this._cache.isRegistered(mfeString)) {
				return lastValueFrom(this._cache.getValue(mfeString));
			}

			this._cache.register(mfeString);

			const moduleType = await this._loadMfeModule<TModule>(mfeString, options);
			const compiledModule = await this._compileModuleWithComponents<TModule>(moduleType);

			const componentName = options.componentName ?? this._getComponentName(mfeString);
			const componentType = this._findComponentType<TModule, TComponent>(
				componentName,
				compiledModule
			);

			if (!componentType) {
				throw new Error(`${componentName} don't registered in module ${moduleType.name}`);
			}

			const moduleRef = compiledModule.ngModuleFactory.create(injector);
			const componentFactory =
				moduleRef.componentFactoryResolver.resolveComponentFactory(componentType);

			this._cache.setValue(mfeString, componentFactory);

			return componentFactory;
		} catch (error) {
			if (this._cache.isRegistered(mfeString)) {
				this._cache.setError(mfeString, error);
			}

			throw error;
		}
	}

	/**
	 * Loads MFE module
	 * @param mfeString MFE string.
	 * @param options options for `loadMfe` helper function.
	 *
	 * @internal
	 */
	private async _loadMfeModule<TModule = unknown>(
		mfeString: string,
		options: LoadMfeOptions = { type: 'module' }
	): Promise<Type<TModule>> {
		const { moduleName, type } = options;
		return await loadMfe<TModule>(mfeString, { moduleName, type });
	}

	/**
	 * Compiles MFE module with declared in this module components.
	 * @param moduleType Module class type.
	 *
	 * @internal
	 */
	private async _compileModuleWithComponents<TModule = unknown>(
		moduleType: Type<TModule>
	): Promise<ModuleWithComponentFactories<TModule>> {
		return await this._compiler.compileModuleAndAllComponentsAsync(moduleType);
	}

	/**
	 * Generates Component class name from MFE string.
	 * @param mfeString MFE string.
	 *
	 * @internal
	 */
	public _getComponentName(mfeString: string): string {
		return mfeString
			.split('/')[1]
			.split('-')
			.map((x) => x.charAt(0).toUpperCase() + x.substr(1))
			.join('')
			.concat('Component');
	}

	/**
	 * Find Component class by componentName.
	 * @param componentName a custom Component name.
	 * @param compiledModule compiled module instance.
	 *
	 * @internal
	 */
	public _findComponentType<TModule = unknown, TComponent = unknown>(
		componentName: string,
		compiledModule: ModuleWithComponentFactories<TModule>
	): Type<TComponent> | undefined {
		return compiledModule.componentFactories.find((f) => f.componentType.name === componentName)
			?.componentType;
	}
}

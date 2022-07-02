import { Type } from '@angular/core';
import { loadRemoteModule, LoadRemoteModuleOptions } from '@angular-architects/module-federation';

import { MfeRegistry } from '../registry';

/**
 *  Options for ```loadMfe``` function.
 */
export type LoadMfeOptions = {
	/**
	 * Type of loaded module as a ```script``` or as a ```module```.
	 */
	type?: LoadRemoteModuleOptions['type'];
};

/**
 * Loads remote module.
 *
 * @param remoteApp The name of the micro-frontend app decalred in ModuleFederationPlugin.
 * @param exposedFile  The key of the exposed module decalred in ModuleFederationPlugin.
 * @param options (Optional) object of options.
 */
export async function loadMfe<T = unknown>(
	remoteApp: string,
	exposedFile: string,
	options: LoadMfeOptions = { type: 'module' }
): Promise<Type<T>> {
	const remoteEntry = MfeRegistry.getInstance().getMfeRemoteEntry(remoteApp);

	const loadRemoteModuleOptions: LoadRemoteModuleOptions =
		options.type === 'module'
			? { type: options.type, remoteEntry, exposedModule: exposedFile }
			: {
					type: options.type,
					remoteEntry,
					exposedModule: exposedFile,
					remoteName: remoteApp,
			  };

	const bundle = await loadRemoteModule(loadRemoteModuleOptions);

	return bundle[exposedFile];
}

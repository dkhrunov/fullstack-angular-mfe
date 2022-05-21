import { Type } from '@angular/core';
import { loadRemoteModule, LoadRemoteModuleOptions } from '@angular-architects/module-federation';

import { MfeRegistry } from '../registry';
import { validateMfeString } from '.';

/**
 *  List of options the `loadMfe` function.
 */
export type LoadMfeOptions = {
	/**
	 * Set custom exposed module name, by default module name = exposedItem + 'Module'.
	 */
	moduleName?: string;
	/**
	 * Type of loaded module as a `script` or as a `module`.
	 */
	type?: LoadRemoteModuleOptions['type'];
};

/**
 * Loads exposed module of the micro-frontend.
 *
 * @param mfeString The name of the micro-frontend and the name of the exposed module in this micro-frontend,
 * are given after slash symbol "/", for example: 'auth-mfe/login'.
 * @param options (Optional) list of options.
 */
export async function loadMfe<T = unknown>(
	mfeString: string,
	options: LoadMfeOptions = { type: 'module' }
): Promise<Type<T>> {
	validateMfeString(mfeString);

	const [appName, exposedItem] = mfeString.split('/');

	if (!exposedItem) {
		throw new Error('Can`t loads micro-frontend because exposed item is undefined');
	}

	const remoteEntry = MfeRegistry.getInstance().getMfeRemoteEntry(appName);
	const exposedModule = exposedItem
		.split('-')
		.map((x) => x.charAt(0).toUpperCase() + x.substr(1))
		.join('');

	const loadRemoteModuleOptions: LoadRemoteModuleOptions =
		options.type === 'module'
			? { type: options.type, remoteEntry, exposedModule }
			: { type: options.type, remoteEntry, exposedModule, remoteName: appName };

	const bundle = await loadRemoteModule(loadRemoteModuleOptions);
	const _moduleName = options.moduleName ?? loadRemoteModuleOptions.exposedModule + 'Module';

	return bundle[_moduleName];
}

import { LoadRemoteModuleOptions } from '@angular-architects/module-federation';

import { MfeRegistry } from '../registry';
import { validateMfeString } from './validate-mfe-string';

/**
 * Parse micro-frontend string and return options for
 * loadRemoteModule function from @angular-architects/module-federation.
 *
 * @param mfe Micro-frontend string
 * @param type Type of exposed module
 */
export function parseMfeString(
	mfe: string,
	type: 'Module' | 'Component' = 'Module'
): Required<LoadRemoteModuleOptions> {
	validateMfeString(mfe);

	const [appName, exposedItem] = mfe.split('/');

	if (!exposedItem) {
		throw new Error('Can`t loads micro-frontend because exposed item is undefined');
	}

	const remoteEntry = MfeRegistry.getInstance().getMfeRemoteEntry(appName);
	const remoteName = appName.replace(/-/g, '_');
	const exposedModule = exposedItem
		.split('-')
		.map((x) => x.charAt(0).toUpperCase() + x.substr(1))
		.join('')
		.concat(type);

	return { remoteEntry, remoteName, exposedModule };
}

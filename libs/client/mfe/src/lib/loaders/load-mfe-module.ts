import { Type } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';

import { validateMfeString } from '../helpers';
import { MfeRegistry } from '../registry';

/**
 * Loads exposed module of micro-frontend.
 *
 * @param mfe The name of the micro-frontend and the name of the exposed module in this micro-frontend,
 * are given after slash symbol "/", for example: 'auth-mfe/login'.
 */
export async function loadMfeModule<T = unknown>(mfe: string): Promise<Type<T>> {
	validateMfeString(mfe);

	// TODO похожи внутренности с loadMfeComponent
	const [_mfe, _module] = mfe.split('/');

	if (!_module) {
		throw new Error('Can`t load micro frontend app because module is undefined');
	}

	const remoteEntry = MfeRegistry.getInstance().getMfeRemoteEntry(_mfe);
	const remoteName = _mfe.replace(/-/g, '_');
	const exposedModule = _module
		.split('-')
		.map((x) => x.charAt(0).toUpperCase() + x.substr(1))
		.join('')
		.concat('Module');

	const remoteModule = await loadRemoteModule({
		remoteEntry,
		remoteName,
		exposedModule,
	});

	return remoteModule[exposedModule];
}

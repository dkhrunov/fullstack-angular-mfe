import { Type } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';

import { validateMfeString } from '../helpers';
import { MfeRegistry } from '../registry';

/**
 * Loads exposed component of micro-frontend.
 *
 * @param mfe The name of the micro-frontend and the name of the exposed component in this micro-frontend,
 * are given after slash symbol "/", for example: 'auth-mfe/login'.
 */
export async function loadMfeComponent<T = unknown>(mfe: string): Promise<Type<T>> {
	validateMfeString(mfe);

	// TODO похожи внутренности с loadMfeModule
	const [_mfe, _component] = mfe.split('/');

	if (!_component) {
		throw new Error('Can`t load micro frontend app because component is undefined');
	}

	const remoteEntry = MfeRegistry.getInstance().getMfeRemoteEntry(_mfe);
	const remoteName = _mfe.replace(/-/g, '_');
	const exposedComponent = _component
		.split('-')
		.map((x) => x.charAt(0).toUpperCase() + x.substr(1))
		.join('')
		.concat('Component');

	const remoteComponent = await loadRemoteModule({
		remoteEntry,
		remoteName,
		exposedModule: exposedComponent,
	});

	return remoteComponent[exposedComponent];
}

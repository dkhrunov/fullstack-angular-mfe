import { Type } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';

import config from '../../../../../../config.json';
import { MfeRegistry } from '../registry';

/**
 * Loads exposed component of microfront.
 *
 * @param mfe The name of the microfront and the name of the exposed component in this microfront,
 * are given after slash symbol "/", for example: 'auth-mfe/login'.
 */
export async function loadMfeComponent<T = unknown>(mfe: string): Promise<Type<T>>;
/**
 * Loads exposed component of microfront.
 *
 * @param mfe The name of the microfront.
 * @param component The name of exposed component in this microfront.
 */
export async function loadMfeComponent<T = unknown>(
	mfe: string,
	component: string
): Promise<Type<T>>;
export async function loadMfeComponent<T = unknown>(
	mfe: string,
	component?: string
): Promise<Type<T>> {
	// TODO похожи внутренности с loadMfeModule
	const [_mfe, _component] = mfe.split('/');

	if (!component && !_component) {
		throw new Error('Can`t load micro frontend app because component is undefined');
	}

	const mfePort = MfeRegistry.instantiate().getMfePort(_mfe);

	const remoteName = _mfe.replace(/-/g, '_');

	const exposedComponent = (component ?? _component)
		.split('-')
		.map((x) => x.charAt(0).toUpperCase() + x.substr(1))
		.join('')
		.concat('Component');

	const remoteComponent = await loadRemoteModule({
		remoteEntry: `${config.remoteEntryUrl}:${mfePort}/${config.remoteEntryFileName}`,
		remoteName,
		exposedModule: exposedComponent,
	});

	return remoteComponent[exposedComponent];
}

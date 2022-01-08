import { loadRemoteModule } from '@angular-architects/module-federation';

import config from '../../../../../../config.json';
import { MfeRegistry } from '../registry';

/**
 * Загружает экспортируемый модуль микрофронта
 * @param mfe Микрофронт (плюс нужно указать module) или микрофронт + экспортируемый модуль (пример: auth-mfe/login)
 * @param module Экспортируемый модуль
 */
export async function loadMfe<T = any>(mfe: string, module?: string): Promise<T> {
	const [_mfe, _module] = mfe.split('/');

	if (!module && !_module) {
		throw new Error('Can`t load micro frontend app because module is undefined');
	}

	const mfePort = MfeRegistry.instantiate().getMfePort(_mfe);

	const remoteName = _mfe.replace(/-/g, '_');

	const exposedModule = (module ?? _module)
		.split('-')
		.map((x) => x.charAt(0).toUpperCase() + x.substr(1))
		.join('')
		.concat('Module');

	const remoteModule = await loadRemoteModule({
		remoteEntry: `${config.remoteEntryUrl}:${mfePort}/${config.remoteEntryFileName}`,
		remoteName,
		exposedModule,
	});

	return remoteModule[exposedModule];
}

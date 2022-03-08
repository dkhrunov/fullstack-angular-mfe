import { applicationGenerator } from '@nrwl/angular/generators';
import { normalizeOptions } from '@nrwl/angular/src/generators/application/lib';
import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';

import { REMOTE_MFE_TAG } from '../../mfe';
import {
	addGlobalAssets,
	addNgZorroAntd,
	getAvailableMfePort,
	replaceEnvironmentFiles,
	replaceRemoteEntryModule,
	replaceRemoteMfeAppModule,
	replaceRemoteMfeWebpackConfig,
} from './helpers';
import { Schema } from './schema';

/**
 * Nx Generator для создания микрофронта
 * @param tree Виртуальная файловая система (AST)
 * @param schema Схема параметров генератора
 */
export async function remoteMfeApplicationGenerator(tree: Tree, schema: Schema) {
	const availablePort = getAvailableMfePort(tree);
	// const hostApp = schema.host ?? 'client-shell-app';

	schema = {
		...schema,
		name: `${schema.name}-mfe`,
		mfe: true,
		mfeType: schema.type,
		port: availablePort,
		// host: schema.host ?? 'client-shell-app',
		tags: schema.tags?.length ? schema.tags + `, ${REMOTE_MFE_TAG}` : REMOTE_MFE_TAG,
	};

	await applicationGenerator(tree, schema);
	await formatFiles(tree);

	const mfeName = schema.directory?.replace(new RegExp('/', 'g'), '-') + '-' + schema.name;

	addNgZorroAntd(tree, mfeName);
	addGlobalAssets(tree, mfeName);
	// linkRemoteWithHost(tree, mfeName, hostApp);

	return () => {
		installPackagesTask(tree);

		const normalizedSchema = normalizeOptions(tree, schema);

		replaceEnvironmentFiles(normalizedSchema);
		replaceRemoteMfeWebpackConfig(normalizedSchema);
		replaceRemoteMfeAppModule(normalizedSchema);
		replaceRemoteEntryModule(normalizedSchema);
	};
}

import { applicationGenerator } from '@nrwl/angular/generators';
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
export async function remoteMfeApplicationGenerator(tree: Tree, schema: Partial<Schema>) {
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
		directory: 'client',
	};

	await applicationGenerator(tree, schema);
	await formatFiles(tree);

	addNgZorroAntd(tree, schema.name!);
	addGlobalAssets(tree, schema.name!);
	// linkRemoteWithHost(tree, schema.name!, hostApp);

	return () => {
		installPackagesTask(tree);

		replaceEnvironmentFiles(schema.name!);
		replaceRemoteMfeWebpackConfig(schema.name!);
		replaceRemoteMfeAppModule(schema.name!);
		replaceRemoteEntryModule(schema.name!);
	};
}

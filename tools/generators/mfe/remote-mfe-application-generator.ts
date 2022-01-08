import { applicationGenerator } from '@nrwl/angular/generators';
import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';

import {
	addSupportNgZorroAntd,
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
	const availablePort = getAvailableMfePort();

	schema = {
		...schema,
		name: `${schema.name}-mfe`,
		mfe: true,
		mfeType: schema.type,
		port: availablePort,
		tags: schema.tags?.length ? schema.tags + ', mfe' : 'mfe',
		directory: 'client',
	};

	await applicationGenerator(tree, schema);
	await formatFiles(tree);

	addSupportNgZorroAntd(tree, schema.name!);

	return () => {
		installPackagesTask(tree);

		replaceEnvironmentFiles(schema.name!);
		replaceRemoteMfeWebpackConfig(schema.name!);
		replaceRemoteMfeAppModule(schema.name!);
		replaceRemoteEntryModule(schema.name!);
	};
}

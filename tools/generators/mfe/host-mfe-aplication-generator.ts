import { applicationGenerator } from '@nrwl/angular/generators';
import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';

import { createEnvironmentFiles, createHostMfeWebpackConfig, getAvailableMfePort } from './helpers';
import { Schema } from './schema';

/**
 * Nx Generator для создания хостового микрофронта
 * @param tree Виртуальная файловая система
 * @param schema Схема параметров генератора
 */
export async function hostMfeApplicationGenerator(tree: Tree, schema: Partial<Schema>) {
	const availablePort = getAvailableMfePort();

	schema = {
		...schema,
		name: `${schema.name}-app`,
		mfe: true,
		mfeType: schema.type,
		port: availablePort,
		tags: schema.tags?.length ? schema.tags + ', app' : 'app',
		directory: 'client',
	};

	await applicationGenerator(tree, schema);
	await formatFiles(tree);

	return () => {
		installPackagesTask(tree);

		createEnvironmentFiles(schema.name!);
		createHostMfeWebpackConfig(schema.name!);
	};
}

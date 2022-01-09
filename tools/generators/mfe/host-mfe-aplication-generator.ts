import { applicationGenerator } from '@nrwl/angular/generators';
import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';

import { HOST_MFE_TAG } from '../../mfe';
import {
	addSupportNgZorroAntd,
	getAvailableMfePort,
	replaceEnvironmentFiles,
	replaceHostMfeWebpackConfig,
} from './helpers';
import { Schema } from './schema';

/**
 * Nx Generator для создания хостового микрофронта
 * @param tree Виртуальная файловая система (AST)
 * @param schema Схема параметров генератора
 */
export async function hostMfeApplicationGenerator(tree: Tree, schema: Partial<Schema>) {
	const availablePort = getAvailableMfePort(tree);

	schema = {
		...schema,
		name: `${schema.name}-app`,
		mfe: true,
		mfeType: schema.type,
		port: availablePort,
		tags: schema.tags?.length ? schema.tags + `, ${HOST_MFE_TAG}` : HOST_MFE_TAG,
		directory: 'client',
	};

	await applicationGenerator(tree, schema);
	await formatFiles(tree);

	addSupportNgZorroAntd(tree, schema.name!);

	return () => {
		installPackagesTask(tree);

		replaceEnvironmentFiles(schema.name!);
		replaceHostMfeWebpackConfig(schema.name!);
	};
}

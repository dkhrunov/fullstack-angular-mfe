import { applicationGenerator } from '@nrwl/angular/generators';
import { normalizeOptions } from '@nrwl/angular/src/generators/application/lib';
import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';

import { HOST_MFE_TAG } from '../../mfe';
import {
	addGlobalAssets,
	addNgZorroAntd,
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
export async function hostMfeApplicationGenerator(tree: Tree, schema: Schema) {
	const availablePort = getAvailableMfePort(tree);

	schema = {
		...schema,
		name: `${schema.name}-app`,
		mfe: true,
		mfeType: schema.type,
		port: availablePort,
		tags: schema.tags?.length ? schema.tags + `, ${HOST_MFE_TAG}` : HOST_MFE_TAG,
	};

	await applicationGenerator(tree, schema);
	await formatFiles(tree);

	const mfeName = schema.directory?.replace(new RegExp('/', 'g'), '-') + '-' + schema.name;

	addNgZorroAntd(tree, mfeName);
	addGlobalAssets(tree, mfeName);

	return () => {
		installPackagesTask(tree);

		const normalizedSchema = normalizeOptions(tree, schema);

		replaceEnvironmentFiles(normalizedSchema);
		replaceHostMfeWebpackConfig(normalizedSchema);
	};
}

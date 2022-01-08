import { applicationGenerator } from '@nrwl/angular/generators';
import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';

import {
	createEnvironmentFiles,
	createRemoteMfeAppModule,
	createRemoteMfeWebpackConfig,
	getAvailableMfePort,
} from './helpers';
import { Schema } from './schema';

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

	return () => {
		installPackagesTask(tree);

		createEnvironmentFiles(schema);
		createRemoteMfeWebpackConfig(schema);
		createRemoteMfeAppModule(schema);
	};
}

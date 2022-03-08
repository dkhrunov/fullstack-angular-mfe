import { Tree } from '@nrwl/devkit';

import { hostMfeApplicationGenerator } from './host-mfe-aplication-generator';
import { remoteMfeApplicationGenerator } from './remote-mfe-application-generator';
import { Schema } from './schema';

export * from './helpers';
export * from './host-mfe-aplication-generator';
export * from './remote-mfe-application-generator';
export { Schema } from './schema';

export default async function (tree: Tree, schema: Schema) {
	switch (schema.type) {
		case 'host':
			return await hostMfeApplicationGenerator(tree, schema);

		case 'remote':
			return await remoteMfeApplicationGenerator(tree, schema);

		default:
			throw new Error(
				'Incorrect MFE application type, choose one of the following: "host" or "remote"'
			);
	}
}

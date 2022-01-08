import * as fs from 'fs';
import * as path from 'path';

import { Schema } from '../schema';

// TODO в подобные функции передавать только name и написать JSDoc
export function createEnvironmentFiles(schema: Partial<Schema>) {
	const environmentDirPath = path.normalize(
		path.resolve(process.cwd(), 'apps/client', schema.name!, 'src/environments')
	);

	const environmentProdPattern = fs.readFileSync(
		path.resolve(__dirname, '../patterns/environment.prod.txt')
	);
	fs.writeFileSync(path.join(environmentDirPath, 'environment.prod.ts'), environmentProdPattern);

	const environmentPattern = fs.readFileSync(
		path.resolve(__dirname, '../patterns/environment.txt')
	);
	fs.writeFileSync(path.join(environmentDirPath, 'environment.ts'), environmentPattern);
}

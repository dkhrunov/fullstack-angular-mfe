import * as fs from 'fs';
import * as path from 'path';

import { Schema } from '../schema';

export function createRemoteMfeAppModule(schema: Partial<Schema>) {
	const appModulePath = path.normalize(
		path.resolve(process.cwd(), 'apps/client', schema.name!, 'src/app/app.module.ts')
	);
	const appModulePattern = fs.readFileSync(path.resolve(__dirname, '../patterns/app.module.txt'));
	fs.writeFileSync(appModulePath, appModulePattern);
}

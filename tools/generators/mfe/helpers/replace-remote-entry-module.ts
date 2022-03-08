import { NormalizedSchema } from '@nrwl/angular/src/generators/application/lib';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Заменить контент файла entry.module.ts
 * @param options Normalized options
 */
export function replaceRemoteEntryModule(options: NormalizedSchema): void {
	const filePath = path.normalize(
		path.resolve(process.cwd(), options.appProjectRoot, 'src/app/remote-entry/entry.module.ts')
	);
	const appModulePattern = fs.readFileSync(
		path.resolve(__dirname, '../patterns/entry.module.txt')
	);
	fs.writeFileSync(filePath, appModulePattern);
}

import { NormalizedSchema } from '@nrwl/angular/src/generators/application/lib';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Заменить контент корневого модуля app.module.ts для микрофронта
 * @param options Normalized options
 */
export function replaceRemoteMfeAppModule(options: NormalizedSchema): void {
	const appModulePath = path.normalize(
		path.resolve(process.cwd(), options.appProjectRoot, 'src/app/app.module.ts')
	);
	const appModulePattern = fs.readFileSync(path.resolve(__dirname, '../patterns/app.module.txt'));
	fs.writeFileSync(appModulePath, appModulePattern);
}

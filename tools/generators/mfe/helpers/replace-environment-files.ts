import { NormalizedSchema } from '@nrwl/angular/src/generators/application/lib';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Заменить контент файла environment.prod.ts и environment.ts
 * @param options Normalized options
 */
export function replaceEnvironmentFiles(options: NormalizedSchema): void {
	const environmentDirPath = path.normalize(
		path.resolve(process.cwd(), options.appProjectRoot, 'src/environments')
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

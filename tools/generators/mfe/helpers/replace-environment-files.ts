import * as fs from 'fs';
import * as path from 'path';

/**
 * Заменить контент файла environment.prod.ts и environment.ts
 * @param mfe Название микрофронта
 */
export function replaceEnvironmentFiles(mfe: string): void {
	const environmentDirPath = path.normalize(
		path.resolve(process.cwd(), 'apps/client', mfe, 'src/environments')
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

import * as fs from 'fs';
import * as path from 'path';

/**
 * Создать файл environment.prod.ts и environment.ts с базовыми параметрами
 * @param mfe Название микрофронта
 */
export function createEnvironmentFiles(mfe: string) {
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

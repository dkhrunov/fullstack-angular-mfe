import * as fs from 'fs';
import * as path from 'path';

/**
 * Заменить контент файла entry.module.ts
 * @param mfe Название микрофронта
 */
export function replaceRemoteEntryModule(mfe: string): void {
	const filePath = path.normalize(
		path.resolve(process.cwd(), 'apps/client', mfe, 'src/app/remote-entry/entry.module.ts')
	);
	const appModulePattern = fs.readFileSync(
		path.resolve(__dirname, '../patterns/entry.module.txt')
	);
	fs.writeFileSync(filePath, appModulePattern);
}

import * as fs from 'fs';
import * as path from 'path';

/**
 * Заменить контент корневого модуля app.module.ts для микрофронта
 * @param mfe Название микрофронта
 */
export function replaceRemoteMfeAppModule(mfe: string): void {
	const appModulePath = path.normalize(
		path.resolve(process.cwd(), 'apps/client', mfe, 'src/app/app.module.ts')
	);
	const appModulePattern = fs.readFileSync(path.resolve(__dirname, '../patterns/app.module.txt'));
	fs.writeFileSync(appModulePath, appModulePattern);
}

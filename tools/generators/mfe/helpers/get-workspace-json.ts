import * as fs from 'fs';
import * as JSON5 from 'json5';
import * as path from 'path';

/**
 * Получить файл конфигурации монорепозитория workspace.json или angular.json
 */
export function getWorkspaceJson(): any {
	const workspaceJsonPath = fs.existsSync(path.resolve(process.cwd(), 'workspace.json'))
		? path.resolve(process.cwd(), 'workspace.json')
		: path.resolve(process.cwd(), 'angular.json');

	return JSON5.parse(fs.readFileSync(workspaceJsonPath, { encoding: 'utf-8' }));
}

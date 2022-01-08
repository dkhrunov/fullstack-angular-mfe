import * as fs from 'fs';
import * as JSON5 from 'json5';
import * as path from 'path';

export function getWorkspaceJson() {
	const workspaceJsonPath = fs.existsSync(path.resolve(process.cwd(), 'workspace.json'))
		? path.resolve(process.cwd(), 'workspace.json')
		: path.resolve(process.cwd(), 'angular.json');

	return JSON5.parse(fs.readFileSync(workspaceJsonPath, { encoding: 'utf-8' }));
}

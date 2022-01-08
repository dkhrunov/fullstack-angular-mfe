import { Tree, updateJson } from '@nrwl/devkit';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Добавляет поддержку стилей для UI кита ng-zorro-antd
 * @param tree Виртуальная файловая система (AST)
 * @param mfe Название микрофронта
 */
export function addSupportNgZorroAntd(tree: Tree, mfe: string): any {
	const workspaceJsonName = fs.existsSync(path.resolve(process.cwd(), 'workspace.json'))
		? 'workspace.json'
		: 'angular.json';

	updateJson(tree, workspaceJsonName, (workspaceJson) => {
		const options = workspaceJson.projects[`client-${mfe}`]?.targets?.build?.options;

		if (!options) {
			return workspaceJson;
		}

		options.assets = options.assets ?? [];
		options.assets.push({
			glob: '**/*',
			input: './node_modules/@ant-design/icons-angular/src/inline-svg/',
			output: '/assets/',
		});

		options.styles = options.styles ?? [];
		options.styles.push('node_modules/ng-zorro-antd/ng-zorro-antd.dark.min.css');

		return workspaceJson;
	});
}

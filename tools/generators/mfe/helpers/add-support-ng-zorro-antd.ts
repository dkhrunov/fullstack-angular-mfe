import { getProjects, Tree, updateProjectConfiguration } from '@nrwl/devkit';

/**
 * Добавляет поддержку стилей для UI кита ng-zorro-antd
 * @param tree Виртуальная файловая система (AST)
 * @param mfe Название микрофронта
 */
export function addSupportNgZorroAntd(tree: Tree, mfe: string): void {
	const projectName = `client-${mfe}`;
	const projectConfig = getProjects(tree).get(projectName);

	if (!projectConfig) return;

	const options = projectConfig.targets?.build?.options;

	if (!options) return;

	options.assets = options.assets ?? [];
	options.assets.push({
		glob: '**/*',
		input: './node_modules/@ant-design/icons-angular/src/inline-svg/',
		output: '/assets/',
	});

	options.styles = options.styles ?? [];
	options.styles.push('node_modules/ng-zorro-antd/ng-zorro-antd.dark.min.css');

	updateProjectConfiguration(tree, `client-${mfe}`, projectConfig);
}

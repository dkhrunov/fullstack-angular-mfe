import { getProjects, Tree, updateProjectConfiguration } from '@nrwl/devkit';

/**
 * Добавляет поддержку Assets
 * @param tree Виртуальная файловая система (AST)
 * @param mfe Название микрофронта
 */
export function addGlobalAssets(tree: Tree, mfe: string): void {
	const projectName = `client-${mfe}`;
	const projectConfig = getProjects(tree).get(projectName);

	if (!projectConfig) return;

	const options = projectConfig.targets?.build?.options;

	if (!options) return;

	options.assets = options.assets ?? [];
	options.assets.push({
		glob: '**/*',
		input: './libs/client/assets/',
		output: '/assets/',
	});

	options.styles = options.styles ?? [];
	options.styles.push('libs/client/assets/styles/styles.scss');

	updateProjectConfiguration(tree, `client-${mfe}`, projectConfig);
}

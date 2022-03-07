import { getWorkspacePath, Tree, updateJson } from '@nrwl/devkit';

/**
 * Добавляет поддержку стилей для UI кита ng-zorro-antd
 * @param tree Виртуальная файловая система (AST)
 * @param remote Название микрофронта
 * @param host Название host-приложения
 */
// FIXME удалить если не будет использоваться
export function linkRemoteWithHost(tree: Tree, remote: string, host: string): void {
	updateJson(tree, getWorkspacePath(tree), (workspaceJson) => {
		const options = workspaceJson.projects[host]?.targets['serve-mfe']?.options;

		if (!options) {
			return workspaceJson;
		}

		options.commands = options.commands ?? [];
		options.commands.push('nx serve remote');

		return workspaceJson;
	});
}

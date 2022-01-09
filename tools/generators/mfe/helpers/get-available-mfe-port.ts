import { getProjects, Tree } from '@nrwl/devkit';

/**
 * Получить доступный порт для микрофронта
 */
export function getAvailableMfePort(tree: Tree): number {
	let availablePort = 4199;

	getProjects(tree).forEach((project) => {
		const port = project.targets?.serve?.options?.port;

		if (port) {
			availablePort = port > availablePort ? port : availablePort;
		}
	});

	return availablePort + 1;
}

import { MFE_PROJECT_REGEXP } from '../../../mfe/mfe-project-regexp';
import { getWorkspaceJson } from './get-workspace-json';

export function getAvailableMfePort(): number {
	const workspaceJson = getWorkspaceJson();

	return (
		Object.keys(workspaceJson.projects)
			.filter((projectName) => projectName.match(MFE_PROJECT_REGEXP))
			.reduce((lastPort, mfeName) => {
				const mfePort = workspaceJson.projects[mfeName].targets?.serve?.options?.port;
				return lastPort < mfePort ? mfePort : lastPort;
			}, 0) + 1
	);
}

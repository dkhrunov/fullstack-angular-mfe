/**
 * Nx workspace.json or angular.json.
 */
export interface IWorkspaceConfig {
	/**
	 * Registered projects in Nx monorep.
	 */
	projects: Record<string, any>;
}

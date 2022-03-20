import { IMfeConfig, IWorkspaceConfig } from '../interfaces';

/**
 * Registry of micro-frontends apps.
 */
export class MfeRegistry {
	private static _instance: MfeRegistry;
	private readonly _mfeAppsConfig: IWorkspaceConfig['projects'];
	private readonly _mfeConfig: IMfeConfig;

	private constructor(
		mfeConfig: IMfeConfig,
		workspaceConfig: IWorkspaceConfig,
		mfeProjectPattern?: RegExp
	) {
		this._mfeConfig = mfeConfig;
		this._mfeAppsConfig = this._parseConfig(workspaceConfig, mfeProjectPattern);
	}

	/**
	 * Get instance of the MfeRegistry
	 */
	public static getInstance(
		mfeConfig?: IMfeConfig,
		workspaceConfig?: IWorkspaceConfig,
		mfeProjectPattern?: RegExp
	): MfeRegistry {
		if (!MfeRegistry._instance) {
			if (!mfeConfig || !workspaceConfig)
				throw new Error(
					'MfeConfig and workspaceConfig should be provided for first time used MfeRegistry.getInstance(mfeConfig, workspaceConfig)'
				);

			MfeRegistry._instance = new MfeRegistry(mfeConfig, workspaceConfig, mfeProjectPattern);
		}

		return MfeRegistry._instance;
	}

	/**
	 * Get the remote entry URL the micro-frontend app
	 * @param mfeApp Micro-frontend app name
	 */
	public getMfeRemoteEntry(mfeApp: string): string {
		return `${this._mfeConfig.remoteEntryUrl}:${this.getMfePort(mfeApp)}/${
			this._mfeConfig.remoteEntryFileName
		}`;
	}

	/**
	 * Get the port on which the micro-frontend app is running
	 * @param mfeApp Micro-frontend app name
	 */
	public getMfePort(mfeApp: string): number {
		if (!this._mfeAppsConfig[mfeApp]) {
			throw new Error(`Project ${mfeApp} not defined in workspace.json file`);
		}

		if (!this._mfeAppsConfig[mfeApp].targets?.serve?.options?.port) {
			throw new Error(
				`Project ${mfeApp} not defined port option (targets.serve.options.port) in workspace.json file`
			);
		}

		return this._mfeAppsConfig[mfeApp].targets.serve.options.port;
	}

	/**
	 * Parse the config, extracting information about each micro-frontend app
	 * @param config Config file
	 */
	private _parseConfig(
		config: IWorkspaceConfig,
		projectPattern?: RegExp
	): IWorkspaceConfig['projects'] {
		return Object.keys(config.projects)
			.filter((projectName) => (projectPattern ? projectName.match(projectPattern) : true))
			.reduce((obj, key) => ({ ...obj, [key]: config.projects[key] }), {});
	}
}

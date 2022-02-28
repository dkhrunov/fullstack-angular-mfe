import { MFE_PROJECT_REGEXP } from '../const';
import { IMfeConfig, IWorkspaceConfig } from '../interfaces';

/**
 * Registry of micro-frontends apps.
 */
export class MfeRegistry {
	private static _instance: MfeRegistry;
	private readonly _mfeAppsConfig: IWorkspaceConfig['projects'];
	private readonly _mfeConfig: IMfeConfig;

	private constructor(mfeConfig: IMfeConfig, workspaceConfig: IWorkspaceConfig) {
		this._mfeConfig = mfeConfig;
		this._mfeAppsConfig = this._parseConfig(workspaceConfig);
	}

	/**
	 * Get instance of the MfeRegistry
	 */
	public static getInstance(
		mfeConfig?: IMfeConfig,
		workspaceConfig?: IWorkspaceConfig
	): MfeRegistry {
		if (!MfeRegistry._instance) {
			if (!mfeConfig || !workspaceConfig)
				throw Error(
					'MfeConfig and workspaceConfig should be provided for first time used MfeRegistry.getInstance(mfeConfig, workspaceConfig)'
				);

			MfeRegistry._instance = new MfeRegistry(mfeConfig, workspaceConfig);
		}

		return MfeRegistry._instance;
	}

	/**
	 * Get the remote entry URL the micro-frontend app
	 * @param mfe Micro-frontend app name
	 */
	public getMfeRemoteEntry(mfe: string): string {
		return `${this._mfeConfig.remoteEntryUrl}:${this.getMfePort(mfe)}/${
			this._mfeConfig.remoteEntryFileName
		}`;
	}

	/**
	 * Get the port on which the micro-frontend app is running
	 * @param mfe Micro-frontend app name
	 */
	public getMfePort(mfe: string): number {
		if (!this._mfeAppsConfig[`client-${mfe}`]) {
			throw new Error(`Project client-${mfe} not defined in workspace.json file`);
		}

		if (!this._mfeAppsConfig[`client-${mfe}`].targets?.serve?.options?.port) {
			throw new Error(
				`Project client-${mfe} not defined port option (targets.serve.options.port) in workspace.json file`
			);
		}

		return this._mfeAppsConfig[`client-${mfe}`].targets.serve.options.port;
	}

	/**
	 * Parse the config, extracting information about each micro-frontend app
	 * @param config Config file
	 */
	private _parseConfig(config: IWorkspaceConfig): IWorkspaceConfig['projects'] {
		return Object.keys(config.projects)
			.filter((projectName) => projectName.match(MFE_PROJECT_REGEXP))
			.reduce((obj, key) => ({ ...obj, [key]: config.projects[key] }), {});
	}
}

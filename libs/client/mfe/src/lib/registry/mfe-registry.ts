// FIXME если файл angular.json будет переименован в workspace.json то будут проблемы
import * as workspaceConfig from '../../../../../../angular.json';
import config from '../../../../../../config.json';
import { MFE_PROJECT_REGEXP } from '../../../../../../tools/mfe';
import { IWorkspaceConfig } from '../interfaces';

// TODO добавить возможность настраивать workspaceConfig, прокидывая данный файл через forRoot(options)
export class MfeRegistry {
	private static _instance: MfeRegistry;
	private readonly _mfeAppsConfig: IWorkspaceConfig['projects'];

	private constructor(config: IWorkspaceConfig) {
		this._mfeAppsConfig = this._parseConfig(config);
	}

	// TODO
	/**
	 * Get instance of the MfeRegistry
	 */
	public static getInstance(_config?: any): MfeRegistry {
		// if (_config) {
		// 	MfeRegistry._instance = new MfeRegistry(_config);
		// }
		//
		// return MfeRegistry._instance;

		if (!MfeRegistry._instance) {
			MfeRegistry._instance = new MfeRegistry(workspaceConfig);
		}

		return MfeRegistry._instance;
	}

	/**
	 * Get the remote entry URL the micro-frontend app
	 * @param mfe Micro-frontend app name
	 */
	public getMfeRemoteEntry(mfe: string): string {
		return `${config.remoteEntryUrl}:${this.getMfePort(mfe)}/${config.remoteEntryFileName}`;
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

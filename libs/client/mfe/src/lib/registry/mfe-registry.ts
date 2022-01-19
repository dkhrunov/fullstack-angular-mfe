import * as workspaceConfig from '../../../../../../angular.json';
import { MFE_PROJECT_REGEXP } from '../../../../../../tools/mfe';
import { IWorkspaceConfig } from '../interfaces';

export class MfeRegistry {
	private static _instance: MfeRegistry;
	private readonly _mfesConfig: IWorkspaceConfig['projects'];

	private constructor(config: IWorkspaceConfig) {
		this._mfesConfig = this._getMfesConfig(config);
	}

	/**
	 * Получить инстанс
	 */
	public static instantiate(): MfeRegistry {
		if (!MfeRegistry._instance) {
			MfeRegistry._instance = new MfeRegistry(workspaceConfig);
		}

		return MfeRegistry._instance;
	}

	/**
	 * Получить порт на котором крутиться микрофронт
	 * @param mfe Микрофронт
	 */
	public getMfePort(mfe: string): number {
		if (!this._mfesConfig[`client-${mfe}`]) {
			throw new Error(`Project client-${mfe} not defined in workspace.json file`);
		}

		if (!this._mfesConfig[`client-${mfe}`].targets?.serve?.options?.port) {
			throw new Error(
				`Project client-${mfe} not defined port option (targets.serve.options.port) in workspace.json file`
			);
		}

		return this._mfesConfig[`client-${mfe}`].targets.serve.options.port;
	}

	/**
	 * Получить конфиги микрофронтов
	 * @param config Файл конфигурации
	 * @private
	 */
	private _getMfesConfig(config: IWorkspaceConfig): IWorkspaceConfig['projects'] {
		return Object.keys(config.projects)
			.filter((projectName) => projectName.match(MFE_PROJECT_REGEXP))
			.reduce((obj, key) => ({ ...obj, [key]: config.projects[key] }), {});
	}
}

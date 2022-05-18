import { MfeConfig } from '../interfaces';

/**
 * Registry of micro-frontends apps.
 */
export class MfeRegistry {
	private static _instance: MfeRegistry;
	private readonly _mfeConfig: MfeConfig;

	private constructor(mfeConfig: MfeConfig) {
		this._mfeConfig = mfeConfig;
	}

	/**
	 * Get instance of the MfeRegistry
	 */
	public static getInstance(mfeConfig?: MfeConfig): MfeRegistry {
		if (!MfeRegistry._instance) {
			if (!mfeConfig)
				throw new Error(
					'MfeConfig should be provided for first time used MfeRegistry.getInstance(mfeConfig)'
				);

			MfeRegistry._instance = new MfeRegistry(mfeConfig);
		}

		return MfeRegistry._instance;
	}

	/**
	 * Get the remote entry URL the micro-frontend app
	 * @param mfeApp Micro-frontend app name
	 */
	public getMfeRemoteEntry(mfeApp: string): string {
		const remoteEntry = this._mfeConfig[mfeApp];

		if (!remoteEntry) {
			throw new Error(
				`'${mfeApp}' micro-frontend is not registered in the MfeRegistery using MfeModule.forRoot({ mfeConfig })`
			);
		}

		return remoteEntry;
	}
}

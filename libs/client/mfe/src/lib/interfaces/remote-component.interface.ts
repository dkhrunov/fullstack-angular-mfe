export interface StandaloneRemoteComponent {
	/**
	 * Remote app name, specified in ModuleFederationPlugin in name config.
	 */
	app: string;
	/**
	 * The key of the exposed component.
	 */
	component: string;
}

export interface RemoteComponentWithModule {
	/**
	 * Remote app name, specified in ModuleFederationPlugin in name config.
	 */
	app: string;
	/**
	 * The key of the exposed component.
	 */
	component: string;
	/**
	 * The key of the exposed module in which the component is declared.
	 */
	module: string;
}

export type RemoteComponent = StandaloneRemoteComponent | RemoteComponentWithModule;

/**
 * Type Guard for RemoteComponent, checks if RemoteComponent is Standalone
 * @param remoteComponent Mfe Remote Component
 * @returns
 */
export function isStandaloneRemoteComponent(
	remoteComponent: RemoteComponent
): remoteComponent is StandaloneRemoteComponent {
	return !Object.prototype.hasOwnProperty.call(remoteComponent, 'module');
}

/**
 * Type Guard for RemoteComponent, checks if RemoteComponent is Modular
 * @param remoteComponent Mfe Remote Component
 * @returns
 */
export function isRemoteComponentWithModule(
	remoteComponent: RemoteComponent
): remoteComponent is RemoteComponentWithModule {
	return Object.prototype.hasOwnProperty.call(remoteComponent, 'module');
}

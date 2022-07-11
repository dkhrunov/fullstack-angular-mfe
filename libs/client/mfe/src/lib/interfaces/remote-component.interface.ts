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

export interface ModularRemoteComponent {
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

export type RemoteComponent = StandaloneRemoteComponent | ModularRemoteComponent;

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
export function isModularRemoteComponent(
	remoteComponent: RemoteComponent
): remoteComponent is ModularRemoteComponent {
	return Object.prototype.hasOwnProperty.call(remoteComponent, 'module');
}

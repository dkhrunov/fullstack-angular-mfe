import { IMfeConfig } from './mfe-config.interface';
import { IWorkspaceConfig } from './workspace-config.interface';

/**
 * Global options.
 */
export interface IMfeModuleRootOptions {
	/**
	 * Options for Micro-frontend app.
	 */
	mfeConfig: IMfeConfig;
	/**
	 * Content of the workspace.json or angular.json file.
	 */
	workspaceConfig: IWorkspaceConfig;
	/**
	 * RegExp for by which projects will be selected from the workspace.json or angular.json.
	 *
	 * If not specified, it will select all.
	 */
	mfeProjectPattern?: RegExp;
	/**
	 * An array of micro-frontends to be loaded on startup.
	 */
	preload?: string[];
	/**
	 * The delay between displaying the contents of the bootloader and the micro-frontend .
	 *
	 * This is to avoid flickering when the micro-frontend loads very quickly.
	 */
	delay?: number;
	/**
	 * Loader micro-frontend.
	 *
	 * Shows when load bundle of another micro-frontend.
	 *
	 * To better UX experience, add this micro-frontend to {@link preload} array.
	 */
	loader?: string;
	/**
	 * Fallback micro-frontend.
	 *
	 * Showing when an error occurs while loading bundle
	 * or when trying to display the contents of another micro-frontend.
	 *
	 * To better UX experience, add this micro-frontend to {@link preload} array.
	 */
	fallback?: string;
}

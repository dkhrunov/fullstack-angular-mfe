import { ModuleWithProviders, NgModule } from '@angular/core';
import { loadRemoteEntry } from '@angular-architects/module-federation';

import { MfeOutletDirective } from './directives';
import { validateMfeString } from './helpers';
import { IMfeModuleRootOptions } from './interfaces';
import { MfeRegistry } from './registry';
import { OPTIONS } from './tokens';

/**
 * Core lib of micro-frontend architecture.
 * ---------------
 *
 * For core module provide MfeModule.forRoot(options). <br/>
 *
 * For feature modules provide MfeModule.
 */
@NgModule({
	declarations: [MfeOutletDirective],
	exports: [MfeOutletDirective],
})
export class MfeModule {
	/**
	 * Sets global configuration of Mfe lib.
	 * @param options Object of options.
	 */
	public static forRoot(options: IMfeModuleRootOptions): ModuleWithProviders<MfeModule> {
		const mfeRegistry = MfeRegistry.getInstance(
			options.mfeConfig,
			options.workspaceConfig,
			options.mfeProjectPattern
		);
		const loadMfeBundle = loadMfeBundleWithMfeRegistry(mfeRegistry);

		if (options.loader) validateMfeString(options.loader);
		if (options.fallback) validateMfeString(options.fallback);

		if (options.preload) {
			options.preload.map((mfe) => loadMfeBundle(mfe));
		}

		return {
			ngModule: MfeModule,
			providers: [
				{
					provide: MfeRegistry,
					useValue: mfeRegistry,
				},
				{
					provide: OPTIONS,
					useValue: options,
				},
			],
		};
	}
}

/**
 * Loads micro-frontend app bundle (HOF - High Order Function).
 * ------
 *
 * Returns function that can load micro-frontend app by provided name.
 * @param mfeRegistry Registry of micro-frontends apps.
 */
function loadMfeBundleWithMfeRegistry(mfeRegistry: MfeRegistry): (mfe: string) => Promise<void> {
	return (mfe: string): Promise<void> => {
		const remoteEntry = mfeRegistry.getMfeRemoteEntry(mfe);
		const remoteName = mfe.replace(/-/g, '_');

		return loadRemoteEntry(remoteEntry, remoteName);
	};
}

import { ModuleWithProviders, NgModule } from '@angular/core';
import { loadRemoteEntry } from '@angular-architects/module-federation';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';

import { DefaultMfeOutletFallbackComponent } from './components';
import { MfeOutletDirective } from './directives';
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
	declarations: [
		MfeOutletDirective,

		// FIXME не динамично для либы
		DefaultMfeOutletFallbackComponent,
	],
	exports: [MfeOutletDirective],
	// FIXME не динамично для либы
	imports: [NzResultModule, NzIconModule],
})
export class MfeModule {
	/**
	 * Sets global configuration of Mfe lib.
	 * @param options Object of options.
	 */
	public static forRoot(options: IMfeModuleRootOptions): ModuleWithProviders<MfeModule> {
		const mfeRegistry = MfeRegistry.getInstance(options.mfeConfig, options.workspaceConfig);
		const loadMfeBundle = loadMfeBundleFromMfeRegistry(mfeRegistry);

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
function loadMfeBundleFromMfeRegistry(mfeRegistry: MfeRegistry): (mfe: string) => Promise<void> {
	return (mfe: string): Promise<void> => {
		const remoteEntry = mfeRegistry.getMfeRemoteEntry(mfe);
		const remoteName = mfe.replace(/-/g, '_');

		return loadRemoteEntry(remoteEntry, remoteName);
	};
}

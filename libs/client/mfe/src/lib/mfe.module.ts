import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { loadRemoteEntry } from '@angular-architects/module-federation';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { DefaultMfeOutletFallbackComponent, DefaultMfeOutletLoaderComponent } from './components';
import { MfeOutletDirective } from './directives';
import { IMfeModuleRootOptions } from './interfaces';
import { MfeRegistry } from './registry';
import { PRELOAD_MFES_TOKEN } from './tokens';

/**
 * Core lib of micro-frontend architecture.
 * ---------------
 *
 * For core module provide MfeModule.forRoot().
 *
 * For feature modules provide MfeModule.
 */
@NgModule({
	declarations: [
		MfeOutletDirective,
		DefaultMfeOutletFallbackComponent,
		DefaultMfeOutletLoaderComponent,
	],
	exports: [MfeOutletDirective],
	providers: [
		{
			provide: MfeRegistry,
			useValue: MfeRegistry.getInstance(),
		},
	],
	imports: [NzResultModule, NzIconModule, NzSpinModule],
})
export class MfeModule {
	public static forRoot(options: IMfeModuleRootOptions): ModuleWithProviders<MfeModule> {
		return {
			ngModule: MfeModule,
			providers: [
				{
					provide: PRELOAD_MFES_TOKEN,
					useValue: options.preload,
				},
			],
		};
	}

	constructor(
		private readonly _mfeRegistry: MfeRegistry,
		@Optional() @Inject(PRELOAD_MFES_TOKEN) private _mfePrefetch: string[]
	) {
		if (this._mfePrefetch) {
			this._mfePrefetch.map((mfe) => this._loadMfeBundle(mfe));
		}
	}

	/**
	 * Loads micro-frontend app bundle
	 * @param mfe Micro-frontend app name
	 * @private
	 */
	private _loadMfeBundle(mfe: string): Promise<void> {
		const remoteEntry = this._mfeRegistry.getMfeRemoteEntry(mfe);
		const remoteName = mfe.replace(/-/g, '_');

		return loadRemoteEntry(remoteEntry, remoteName);
	}
}

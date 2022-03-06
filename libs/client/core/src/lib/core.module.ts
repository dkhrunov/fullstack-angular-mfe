import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthModule } from '@nx-mfe/client/auth';
import { CONFIG, ConfigModule, IConfig } from '@nx-mfe/client/config';
import { InjectorContainerModule } from '@nx-mfe/client/injector-container';
import { MfeModule } from '@nx-mfe/client/mfe';

// FIXME могут быть проблемы во время сборки
import * as mfeConfig from '../../../../../mfe-config.json';
// FIXME могут быть проблемы во время сборки
import * as workspaceConfig from '../../../../../workspace.json';

/**
 * Provides core functionality of apps and micro-frontends.
 */
@NgModule({
	imports: [
		AuthModule,
		ConfigModule,
		InjectorContainerModule,
		MfeModule.forRoot({
			mfeConfig: mfeConfig,
			workspaceConfig: workspaceConfig,
			preload: ['loaders-mfe'],
			loaderDelay: 300,
			loaderMfe: 'loaders-mfe/spinner',
		}),
	],
})
export class CoreModule {
	/**
	 * Used in app.module.ts files in applications and micro-frontends to define the core of the application.
	 * --------
	 *
	 * You can set your own configurations for micro-frontends in standalone app launch mode. <br/>
	 *
	 * **Limitation:** If the remote micro-frontend is not running as a standalone app,
	 * then the remote micro-frontend will always use the config obtained
	 * from the host micro-frontend (shell) inside which it is used.
	 *
	 * @param config Application configuration object (environment config file).
	 */
	public static forRoot(config: IConfig): ModuleWithProviders<CoreModule> {
		return {
			ngModule: CoreModule,
			providers: [
				{
					provide: CONFIG,
					useValue: config,
				},
			],
		};
	}
}

import { ModuleWithProviders, NgModule } from '@angular/core';
// @ts-ignore
import ArrowRight16 from '@carbon/icons/es/arrow--right/16';
// @ts-ignore
import ArrowRight20 from '@carbon/icons/es/arrow--right/20';
// @ts-ignore
import Information16 from '@carbon/icons/es/information/16';
// @ts-ignore
import Information20 from '@carbon/icons/es/information/20';
// @ts-ignore
import View16 from '@carbon/icons/es/view/16';
// @ts-ignore
import View20 from '@carbon/icons/es/view/20';
// @ts-ignore
import ViewOff16 from '@carbon/icons/es/view--off/16';
// @ts-ignore
import ViewOff20 from '@carbon/icons/es/view--off/20';
import { AuthModule } from '@nx-mfe/client/auth';
import { ENVIRONMENT, IEnvironment } from '@nx-mfe/client/environment';
import { InjectorContainerModule } from '@nx-mfe/client/injector-container';
import { MfeModule } from '@nx-mfe/client/mfe';
import { IconModule } from 'carbon-components-angular';
import { IconService } from 'carbon-components-angular';

import { microfrontend as mfeConfig } from './microfrontends';

/**
 * Provides core functionality of apps and micro-frontends.
 */
@NgModule({
	imports: [
		AuthModule,
		InjectorContainerModule,
		IconModule,
		// FIXME подумать что можно с этим сделат, проблема с тем что в Remote не нужны зависимости из preload
		// как варик можно выпилить отсюда и объявлять не посредственно в нужных модулях
		MfeModule.forRoot({
			mfeConfig,
			preload: ['client-loaders-mfe', 'client-fallbacks-mfe'],
			loaderDelay: 500,
			loader: 'client-loaders-mfe/spinner',
			fallback: 'client-fallbacks-mfe/mfe-fallback',
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
	 * @param environment Application environment file.
	 */
	public static forRoot(environment: IEnvironment): ModuleWithProviders<CoreModule> {
		return {
			ngModule: CoreModule,
			providers: [
				{
					provide: ENVIRONMENT,
					useValue: environment,
				},
			],
		};
	}

	constructor(protected iconService: IconService) {
		iconService.registerAll([
			View16,
			View20,
			ViewOff16,
			ViewOff20,
			ArrowRight16,
			ArrowRight20,
			Information16,
			Information20,
		]);
	}
}

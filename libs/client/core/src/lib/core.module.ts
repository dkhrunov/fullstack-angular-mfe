import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthModule } from '@nx-mfe/client/auth';
import { ENVIRONMENT, IEnvironment } from '@nx-mfe/client/environment';
import { InjectorContainerModule } from '@nx-mfe/client/injector-container';
import { MfeForRootOptions, MfeModule } from '@nx-mfe/client/mfe';

import { microfrontend as mfeConfig } from './microfrontends';

const DEFAULT_MFE_OPTIONS: MfeForRootOptions = {
  // Async Observable load mfe config
  // mfeConfig: {
  //   useLoader: () => of(mfeConfig).pipe(delay(2000)),
  // },

  // // Async Promise load mfe config
  // mfeConfig: {
  //   useLoader: () => {
  //     return new Promise<MfeConfig>((resolve) => {
  //       setTimeout(() => {
  //         resolve(mfeConfig);
  //       }, 2000);
  //     });
  //   },
  // },

  // Sync load mfe config
  mfeConfig,
  preload: ['client-loaders-mfe', 'client-fallbacks-mfe'],
  loaderDelay: 500,
  loader: {
    app: 'client-loaders-mfe',
    module: 'SpinnerModule',
    component: 'SpinnerComponent',
  },
  fallback: {
    app: 'client-fallbacks-mfe',
    module: 'MfeFallbackModule',
    component: 'MfeFallbackComponent',
  },
};

/**
 * Provides core functionality of apps and micro-frontends.
 */
@NgModule({
  imports: [
    AuthModule,
    InjectorContainerModule,
    // FIXME подумать что можно с этим сделать, проблема с тем что в Remote не нужны зависимости из preload
    // как варик можно выпилить отсюда и объявлять не посредственно в нужных модулях
    MfeModule.forRoot(DEFAULT_MFE_OPTIONS),
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
}

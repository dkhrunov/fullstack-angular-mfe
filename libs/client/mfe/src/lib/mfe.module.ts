import { loadRemoteEntry } from '@angular-architects/module-federation';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { firstValueFrom, from, Observable, tap } from 'rxjs';

import { MfeOutletDirective } from './directives';
import { isMfeConfigAsync, MfeConfig, MfeForRootOptions } from './interfaces';
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
  public static forRoot(options: MfeForRootOptions): ModuleWithProviders<MfeModule> {
    const { preload, mfeConfig } = options;
    const providers: Provider[] = [
      {
        provide: OPTIONS,
        useValue: options,
      },
    ];

    if (isMfeConfigAsync(mfeConfig)) {
      providers.push({
        provide: APP_INITIALIZER,
        useFactory: (): (() => Observable<MfeConfig>) => {
          return () => {
            return from(mfeConfig.useLoader(...(mfeConfig.deps ?? []))).pipe(
              tap((config) => initializeMfeRegistry(config, preload))
            );
          };
        },
        multi: true,
      });
    } else {
      initializeMfeRegistry(mfeConfig, preload);
    }

    return { ngModule: MfeModule, providers };
  }
}

function initializeMfeRegistry(config: MfeConfig, preload?: string[]): MfeRegistry {
  const mfeRegistry = MfeRegistry.instance;
  mfeRegistry.setMfeConfig(config);
  const loadMfeBundle = loadMfeBundleWithMfeRegistry(mfeRegistry);

  if (preload) {
    preload.map((mfe) => loadMfeBundle(mfe));
  }

  return mfeRegistry;
}

/**
 * Loads micro-frontend app bundle (HOF - High Order Function).
 * ------
 *
 * Returns function that can load micro-frontend app by provided name.
 * @param mfeRegistry Registry of micro-frontends apps.
 */
function loadMfeBundleWithMfeRegistry(mfeRegistry: MfeRegistry): (mfe: string) => Promise<void> {
  return async (mfeString: string): Promise<void> => {
    const remoteEntry = await firstValueFrom(mfeRegistry.getMfeRemoteEntry(mfeString));

    return loadRemoteEntry({ type: 'module', remoteEntry });
  };
}

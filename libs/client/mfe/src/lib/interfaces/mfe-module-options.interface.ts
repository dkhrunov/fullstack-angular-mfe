import { Observable } from 'rxjs';

import { MfeConfig } from './mfe-config.interface';
import { RemoteComponent } from './remote-component.interface';

/**
 * Sync list of available micro-frontends.
 */
export type MfeSyncConfig = MfeConfig;

export type MfeAsyncConfig = {
  /**
   * A function to invoke to load a `MfeConfig`. The function is invoked with
   * resolved values of `token`s in the `deps` field.
   */
  useLoader: (...deps: any[]) => Observable<MfeSyncConfig> | Promise<MfeSyncConfig>;
  /**
   * A list of `token`s to be resolved by the injector. The list of values is then
   * used as arguments to the `loader` function.
   */
  deps?: any[];
};

/**
 * Type of sync / async list of available micro-frontends.
 */
export type MfeConfigOption = MfeSyncConfig | MfeAsyncConfig;

/**
 * Type guard check that NgxMfeConfig is async list of available micro-frontends.
 */
export const isMfeConfigAsync = (config: MfeConfigOption): config is MfeAsyncConfig => {
  return Object.prototype.hasOwnProperty.call(config, 'loader');
};

/**
 * Global options.
 */
export interface MfeOptions {
  /**
   * List of names of remote appls, declared apps will be downloaded immediately and stored in the cache.
   */
  preload?: string[];
  /**
   * Loader remote component.
   *
   * Shows when load bundle of the micro-frontend.
   *
   * For better UX, add this micro-frontend to {@link preload} array.
   */
  loader?: RemoteComponent;
  /**
   * The delay between displaying the contents of the bootloader and the micro-frontend.
   *
   * This is to avoid flickering when the micro-frontend loads very quickly.
   */
  loaderDelay?: number;
  /**
   * Fallback remote component.
   *
   * Showing when an error occurs while loading bundle
   * or when trying to display the contents of the micro-frontend.
   *
   * For better UX, add this micro-frontend to {@link preload} array.
   */
  fallback?: RemoteComponent;
}

/**
 * Options forRoot configuration of `NgxMfeModule`
 */
export type MfeForRootOptions = MfeOptions & {
  /**
   * List of available micro-frontends.
   */
  mfeConfig: MfeConfigOption;
};

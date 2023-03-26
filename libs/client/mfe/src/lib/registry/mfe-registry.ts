import { map, Observable, ReplaySubject, take } from 'rxjs';

import { MfeConfig } from '../interfaces';

/**
 * Registry of micro-frontends apps.
 */
export class MfeRegistry {
  private static _instance: MfeRegistry;

  private readonly _mfeConfig$ = new ReplaySubject<MfeConfig>(1);

  /**
   * Get instance of the MfeRegistry
   */
  public static get instance(): MfeRegistry {
    if (!MfeRegistry._instance) {
      MfeRegistry._instance = new MfeRegistry();
    }

    return MfeRegistry._instance;
  }

  private constructor() {}

  public setMfeConfig(config: MfeConfig): void {
    this._mfeConfig$.next(config);
  }

  /**
   * Get the remote entry URL the micro-frontend app
   * @param mfeApp Micro-frontend app name
   */
  public getMfeRemoteEntry(mfeApp: string): Observable<string> {
    return this._mfeConfig$.pipe(
      take(1),
      map((config) => {
        const remoteEntry = config[mfeApp];

        if (!remoteEntry) {
          throw new Error(
            `'${mfeApp}' micro-frontend is not registered in the MfeRegistery using MfeModule.forRoot({ mfeConfig })`
          );
        }

        return remoteEntry;
      })
    );
  }
}

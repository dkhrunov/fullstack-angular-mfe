import { ModuleWithProviders, NgModule } from '@angular/core';

import { CONFIG } from './injection-tokens';
import { IConfig } from './interfaces';

@NgModule({})
export class ConfigModule {
	/**
	 * Используется для определения файла конфигурации приложения
	 *
	 * @param config объект конфигурации приложения
	 */
	// TODO ни где не настраивается
	public static forRoot(config: IConfig): ModuleWithProviders<ConfigModule> {
		return {
			ngModule: ConfigModule,
			providers: [
				{
					provide: CONFIG,
					useValue: config,
				},
			],
		};
	}
}

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { IConfig } from './interfaces';
import { ConfigToken } from './tokens';

@NgModule({
	imports: [CommonModule],
})
export class ClientConfigModule {
	/**
	 * Используется для определения файла конфигурации приложения
	 *
	 * @param config объект конфигурации приложения
	 */
	public static forRoot(config: IConfig): ModuleWithProviders<ClientConfigModule> {
		return {
			ngModule: ClientConfigModule,
			providers: [
				{
					provide: ConfigToken,
					useValue: config,
				},
			],
		};
	}
}

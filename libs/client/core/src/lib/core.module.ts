import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthModule } from '@nx-mfe/client/auth';
import { DecoratorsModule } from '@nx-mfe/client/common';
import { CONFIG_TOKEN, ConfigModule, IConfig } from '@nx-mfe/client/config';

@NgModule({
	imports: [AuthModule, ConfigModule, DecoratorsModule],
})
export class CoreModule {
	/**
	 * Используется в app.module.ts файлах в приложениях и микрофронтах для определения ядра приложения.
	 *
	 * Можно задать собственные конфигурации для микроприложений в режиме запуска standalone app.
	 *
	 * **Ограничение:**
	 *
	 * Если Remote-микрофронт запущен не как standalone app, то Remote-микрофронт
	 * всегда будет использовать конфиг полученный из Host-микрофронта (shell) внутри которого он используется.
	 *
	 * @param config объкет конфигурации приложения
	 */
	public static forRoot(config: IConfig): ModuleWithProviders<CoreModule> {
		return {
			ngModule: CoreModule,
			providers: [
				{
					provide: CONFIG_TOKEN,
					useValue: config,
				},
			],
		};
	}
}

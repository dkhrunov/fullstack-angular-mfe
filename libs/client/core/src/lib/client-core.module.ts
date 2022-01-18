import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ClientAuthModule } from '@nx-mfe/client/auth';
import { ClientConfigModule, ConfigToken, IConfig } from '@nx-mfe/client/config';

@NgModule({
	imports: [CommonModule, ClientAuthModule, ClientConfigModule],
})
export class ClientCoreModule {
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
	public static forRoot(config: IConfig): ModuleWithProviders<ClientCoreModule> {
		return {
			ngModule: ClientCoreModule,
			providers: [
				{
					provide: ConfigToken,
					useValue: config,
				},
			],
		};
	}
}

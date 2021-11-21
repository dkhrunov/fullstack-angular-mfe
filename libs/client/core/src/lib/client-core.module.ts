import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
	ClientConfigModule,
	ConfigToken,
	IConfig,
} from '@nx-mfe/client/config';
import { ClientAuthModule } from '@nx-mfe/client-auth';

@NgModule({
	imports: [CommonModule, ClientAuthModule, ClientConfigModule],
})
export class ClientCoreModule {
	/**
	 * Используется в app.module.ts файлах в приложениях и микрофронтах для определения
	 * конфигурации, можно задать собственные конфигурации для микроприложений в режиме запуска standalone app.
	 *
	 * **Ограничения:**
	 * - Нет возможности для каждого микрофронта задать собственный конфиг,
	 * микрофронт всегда будет использовать конфиг определенный в приложении (shell), в котором он используется
	 *
	 * @param config объкет конфигурации приложения
	 */
	public static forApp(
		config: IConfig
	): ModuleWithProviders<ClientCoreModule> {
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

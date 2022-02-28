import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthModule } from '@nx-mfe/client/auth';
import { CONFIG, ConfigModule, IConfig } from '@nx-mfe/client/config';
// TODO circular dep with @Confirmable from common lib
import { MfeModule } from '@nx-mfe/client/mfe';

// FIXME могут быть проблемы во время сборки
import * as workspaceConfig from '../../../../../angular.json';
// FIXME могут быть проблемы во время сборки
import * as mfeConfig from '../../../../../mfe-config.json';
import { InjectorContainerModule } from './injector-container.module';

@NgModule({
	imports: [
		AuthModule,
		ConfigModule,
		InjectorContainerModule,
		MfeModule.forRoot({
			mfeConfig: mfeConfig,
			workspaceConfig: workspaceConfig,
			preload: [],
		}),
	],
})
// TODO jsDoc
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
					provide: CONFIG,
					useValue: config,
				},
			],
		};
	}
}

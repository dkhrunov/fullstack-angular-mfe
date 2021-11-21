import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { ETokenStorageType } from './enums';
import { TokenStorage, TokenStorageFactory } from './token-storage';

@NgModule({
	imports: [CommonModule],
})
export class ClientTokenManagerModule {
	public static forRoot(
		storageType: ETokenStorageType
	): ModuleWithProviders<ClientTokenManagerModule> {
		return {
			ngModule: ClientTokenManagerModule,
			providers: [
				{
					provide: TokenStorage,
					useFactory: () => TokenStorageFactory.create(storageType),
				},
			],
		};
	}
}

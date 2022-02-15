import { Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
	imports: [FormsModule, NzModalModule],
})
export class InjectorContainerModule {
	static injector: Injector;

	constructor(injector: Injector) {
		InjectorContainerModule.injector = injector;
	}
}

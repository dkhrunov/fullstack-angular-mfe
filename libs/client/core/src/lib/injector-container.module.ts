import { Injector, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
	imports: [ReactiveFormsModule, NzModalModule],
})
export class InjectorContainerModule {
	static injector: Injector;

	constructor(injector: Injector) {
		InjectorContainerModule.injector = injector;
	}
}

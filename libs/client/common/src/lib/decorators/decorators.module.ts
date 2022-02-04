import { Injector, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';

// TODO раньше назывался InjectorContainerModule, мб переименовать для понятности???
@NgModule({
	// TODO вынести в FormDecorators
	imports: [ReactiveFormsModule, NzModalModule],
})
export class DecoratorsModule {
	static injector: Injector;

	constructor(injector: Injector) {
		DecoratorsModule.injector = injector;
	}
}

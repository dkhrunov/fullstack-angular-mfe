import { Injector, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// TODO раньше назывался InjectorContainerModule, мб переименовать для понятности???
@NgModule({
	imports: [ReactiveFormsModule],
})
export class FormDecoratorsModule {
	static injector: Injector;

	constructor(injector: Injector) {
		FormDecoratorsModule.injector = injector;
	}
}

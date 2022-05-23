import { Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Container of providers, that can get without constructor DI.
 * ------
 *
 * Add new imports and providers careful, coz it increase bundle size.
 *
 * @example
 * // get FormBuilder without constructor DI.
 * const fb = InjectorContainerModule.injector.get(FormBuilder);
 */
@NgModule({
	imports: [FormsModule],
})
export class InjectorContainerModule {
	public static injector: Injector;

	constructor(injector: Injector) {
		InjectorContainerModule.injector = injector;
	}
}

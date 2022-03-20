import { Type } from '@angular/core';

/**
 * Data of the loaded micro-frontend app.
 */
export interface LoadedMfe<TModule = unknown, TComponent = unknown> {
	/**
	 * Loaded module class of micro-frontend.
	 */
	ModuleClass: Type<TModule>;
	/**
	 * Loaded component class of micro-frontend.
	 */
	ComponentClass: Type<TComponent>;
}

import { Type } from '@angular/core';

/**
 * Data of the loaded micro-frontend app.
 */
export interface LoadedMfe<TModule = unknown, TComponent = unknown> {
	/**
	 * Loaded module class of micro-frontend.
	 */
	module: Type<TModule>;
	/**
	 * Loaded component class of micro-frontend.
	 */
	component: Type<TComponent>;
}

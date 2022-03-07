import { Type } from '@angular/core';

export interface LoadedMfe<TModule = unknown, TComponent = unknown> {
	module: Type<TModule>;
	component: Type<TComponent>;
}

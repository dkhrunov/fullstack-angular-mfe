import { Schema as AngularApplicationSchema } from '@nrwl/angular/src/generators/application/schema';

import { Type } from './types';

export interface Schema extends AngularApplicationSchema {
	type?: Type;
}

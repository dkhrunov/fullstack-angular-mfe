import { ComponentFactory } from '@angular/core';

/**
 * Outputs of dynamic loaded component or micro-frontend component.
 */
export type DynamicComponentOutputs = ComponentFactory<unknown>['outputs'];

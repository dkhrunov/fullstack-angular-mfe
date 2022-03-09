import { ComponentFactory } from '@angular/core';

/**
 * Inputs of dynamic loaded component or micro-frontend component.
 */
export type DynamicComponentInputs = ComponentFactory<unknown>['inputs'];

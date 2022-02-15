import { ComponentFactory, Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';

/**
 * Main reason to create cache is to avoid race conditions when two microfronts are requested at the same time.
 * It also makes it possible to take microfronts from the cache, instead of second load.
 */
@Injectable({
	providedIn: 'root',
})
export class MfeComponentsCache {
	private readonly _map = new Map<string, AsyncSubject<ComponentFactory<unknown>>>();

	public setValue(mfe: string, value: ComponentFactory<unknown>): void {
		this.getValue(mfe).next(value);
		this.getValue(mfe).complete();
	}

	public getValue(mfe: string): AsyncSubject<ComponentFactory<unknown>> {
		const mfeSubject = this._map.get(mfe);

		if (!mfeSubject) throw Error(`MFE - ${mfe} dont exist in cache`);

		return mfeSubject;
	}

	public registerMfe(mfe: string): void {
		this._map.set(mfe, new AsyncSubject<ComponentFactory<unknown>>());
	}

	public isMfeRegistered(mfe: string): boolean {
		return this._map.has(mfe);
	}

	public setError(mfe: string, error: unknown): void {
		this.getValue(mfe).error(error);
		this.getValue(mfe).complete();
	}
}

import { ComponentFactory, Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';

/**
 * Main reason to create cache is to avoid race conditions
 * when two micro-frontends are requested at the same time.
 *
 * It also makes it possible to take micro-frontends from the cache,
 * instead of second load.
 */
// TODO jsDoc
@Injectable({
	providedIn: 'root',
})
export class MfeComponentsCache {
	private readonly _map = new Map<string, AsyncSubject<ComponentFactory<any>>>();

	public registerMfe<C>(mfe: string): void {
		this._map.set(mfe, new AsyncSubject<ComponentFactory<C>>());
	}

	public isMfeRegistered(mfe: string): boolean {
		return this._map.has(mfe);
	}

	/**
	 * Set to cache ComponentFactory of micro-frontend.
	 * @param mfe micro-frontend name.
	 * @param value ComponentFactory
	 */
	public setValue<C>(mfe: string, value: ComponentFactory<C>): void {
		const cache = this.getValue(mfe);

		cache.next(value);
		cache.complete();
	}

	public setError<E>(mfe: string, error: E): void {
		const cache = this.getValue(mfe);

		cache.error(error);
		cache.complete();
	}

	public getValue<C>(mfe: string): AsyncSubject<ComponentFactory<C>> {
		const mfeSubject = this._map.get(mfe);

		if (!mfeSubject) throw Error(`MFE - ${mfe} dont exist in cache`);

		return mfeSubject;
	}
}

import { ComponentFactory, Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';

/**
 * Cache of the loaded micro-frontend apps.
 *
 * Main reason to create cache is to avoid race conditions
 * when two micro-frontends are requested at the same time.
 */
@Injectable({
	providedIn: 'root',
})
export class MfeComponentsCache {
	private readonly _map = new Map<string, AsyncSubject<ComponentFactory<any>>>();

	/**
	 * Register a new micro-frontend.
	 * @param mfe Micro-frontend string
	 */
	public register<C>(mfe: string): void {
		if (this.isRegistered(mfe)) return;

		this._map.set(mfe, new AsyncSubject<ComponentFactory<C>>());
	}

	/**
	 * Checks that specified micro-frontend app already registered.
	 * @param mfe Micro-frontend string
	 */
	public isRegistered(mfe: string): boolean {
		return this._map.has(mfe);
	}

	/**
	 * Set to cache ComponentFactory of micro-frontend.
	 * @param mfe Micro-frontend string
	 * @param value ComponentFactory for that micro-frontend
	 */
	public setValue<C>(mfe: string, value: ComponentFactory<C>): void {
		const cache = this.getValue(mfe);

		cache.next(value);
		cache.complete();
	}

	/**
	 * Sets the error that occurs in the loading and compiling micro-frontend.
	 *
	 * @param mfe Micro-frontend string
	 * @param error Error
	 */
	public setError<E>(mfe: string, error: E): void {
		const cache = this.getValue(mfe);

		cache.error(error);
		cache.complete();
	}

	/**
	 * Gets ComponentFactory of the micro-frontend.
	 *
	 * @param mfe Micro-frontend string
	 */
	public getValue<C>(mfe: string): AsyncSubject<ComponentFactory<C>> {
		const mfeSubject = this._map.get(mfe);

		if (!mfeSubject) throw new Error(`MFE - ${mfe} dont exist in cache`);

		return mfeSubject;
	}
}

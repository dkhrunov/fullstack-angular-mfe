import { ComponentFactory, Injectable, Type } from '@angular/core';
import { AsyncSubject, lastValueFrom } from 'rxjs';

import {
	isModularRemoteComponent,
	ModularRemoteComponent,
	RemoteComponent,
	StandaloneRemoteComponent,
} from '../interfaces';

/**
 * Cache of the loaded micro-frontend apps.
 *
 * Main reasons to create cache:
 * 1) Avoid race condition, when same micro-frontend are requested twice or more times at the same time.
 * 2) Cache already loaded MFE component and dont make same request twice.
 */
@Injectable({
	providedIn: 'root',
})
export class MfeComponentsCache {
	private readonly _map = new Map<string, AsyncSubject<ComponentFactory<any> | Type<any>>>();

	/**
	 * Register a new micro-frontend cache.
	 * @param remoteComponent Mfe Remote Component
	 */
	public register(remoteComponent: RemoteComponent): void {
		if (this.isRegistered(remoteComponent)) return;

		const key = this.generateKey(remoteComponent);
		this._map.set(key, new AsyncSubject<ComponentFactory<any> | Type<any>>());
	}

	/**
	 * Unregister a micro-frontend cache.
	 * @param remoteComponent Mfe Remote Component
	 */
	public unregister(remoteComponent: RemoteComponent): void {
		if (!this.isRegistered(remoteComponent)) return;

		const key = this.generateKey(remoteComponent);
		this._map.delete(key);
	}

	/**
	 * Checks that specified micro-frontend app already registered.
	 * @param remoteComponent Mfe Remote Component
	 */
	public isRegistered(remoteComponent: RemoteComponent): boolean {
		const key = this.generateKey(remoteComponent);
		return this._map.has(key);
	}

	/**
	 * Set to cache ComponentFactory of micro-frontend.
	 * @param remoteComponent Mfe Remote Component
	 * @param value ComponentFactory for that micro-frontend
	 */
	public setValue<TComponent>(
		remoteComponent: ModularRemoteComponent,
		value: ComponentFactory<TComponent>
	): void;

	public setValue<TComponent>(
		remoteComponent: StandaloneRemoteComponent,
		value: Type<TComponent>
	): void;

	public setValue<TComponent>(
		remoteComponent: RemoteComponent,
		value: ComponentFactory<TComponent> | Type<TComponent>
	): void {
		if (!this.isRegistered(remoteComponent)) {
			throw new Error(
				`Error while trying to set value into MFE cache, this key - "${JSON.stringify(
					remoteComponent
				)}" does not exist in cache`
			);
		}

		if (isModularRemoteComponent(remoteComponent)) {
			const cache = this.getCache<TComponent>(remoteComponent);
			cache.next(value as ComponentFactory<TComponent>);
			cache.complete();
		}

		const cache = this.getCache<TComponent>(remoteComponent);
		cache.next(value as Type<TComponent>);
		cache.complete();
	}

	/**
	 * Sets the error that occurs in the loading and compiling micro-frontend.
	 * @param remoteComponent Mfe Remote Component
	 * @param error Error
	 */
	public setError(remoteComponent: RemoteComponent, error: any): void {
		if (!this.isRegistered(remoteComponent)) {
			throw new Error(
				`Error while trying to set error into MFE cache, this key - "${JSON.stringify(
					remoteComponent
				)}" does not exist in cache`
			);
		}

		const cache = this.getCache(remoteComponent);
		cache.error(error);
		cache.complete();
	}

	/**
	 * Gets ComponentFactory or Component Class of the micro-frontend.
	 *
	 * ---------------------
	 * Returns ComponentFactory of MFE for modular component,
	 * and in other hand returns Component Class of MFE for standalone component.
	 * @param remoteComponent Mfe Remote Component
	 */
	public getValue<TComponent>(
		remoteComponent: ModularRemoteComponent
	): Promise<ComponentFactory<TComponent>>;

	public getValue<TComponent>(
		remoteComponent: StandaloneRemoteComponent
	): Promise<Type<TComponent>>;

	public getValue<TComponent>(
		remoteComponent: RemoteComponent
	): Promise<Type<TComponent>> | Promise<ComponentFactory<TComponent>> {
		if (isModularRemoteComponent(remoteComponent)) {
			const cache = this.getCache<TComponent>(remoteComponent);
			return lastValueFrom(cache);
		}

		const cache = this.getCache<TComponent>(remoteComponent);
		return lastValueFrom(cache);
	}

	/**
	 * Gets the AsyncSubject cache value from Map
	 * @param remoteComponent Mfe Remote Component
	 */
	protected getCache<TComponent>(
		remoteComponent: ModularRemoteComponent
	): AsyncSubject<ComponentFactory<TComponent>>;

	protected getCache<TComponent>(
		remoteComponent: StandaloneRemoteComponent
	): AsyncSubject<Type<TComponent>>;

	protected getCache<TComponent>(
		remoteComponent: RemoteComponent
	): AsyncSubject<Type<TComponent>> | AsyncSubject<ComponentFactory<TComponent>> {
		const key = this.generateKey(remoteComponent);
		const value = this._map.get(key);

		if (!value)
			throw new Error(
				`Error MFE "${JSON.stringify(remoteComponent)}" does not exist in cache`
			);

		if (isModularRemoteComponent(remoteComponent)) {
			return value as AsyncSubject<ComponentFactory<TComponent>>;
		}

		return value as AsyncSubject<Type<TComponent>>;
	}

	/**
	 * Generates a cache key based on RemoteComponent
	 * @param remoteComponent Mfe Remote Component
	 */
	protected generateKey(remoteComponent: RemoteComponent): string {
		if (isModularRemoteComponent(remoteComponent)) {
			return `${remoteComponent.app}/${remoteComponent.component}/${remoteComponent.module}`;
		}
		return `${remoteComponent.app}/${remoteComponent.component}`;
	}
}

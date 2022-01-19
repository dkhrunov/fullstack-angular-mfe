import { ETokenStorageType } from '../enums';
import { TokenStorage } from './token-storage';
import { tokenStorageMap } from './token-storage-map';

export class TokenStorageFactory {
	public static create(type: ETokenStorageType): TokenStorage {
		const TokenStorage = tokenStorageMap.get(type);

		if (!TokenStorage)
			throw new Error(`Error: this storage strategy type - ${type} not supported`);

		return new TokenStorage();
	}
}

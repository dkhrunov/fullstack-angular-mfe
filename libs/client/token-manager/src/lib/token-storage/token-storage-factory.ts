import { TokenStorage } from './token-storage';
import { tokenStorageMap } from './token-storage-map';

// TODO преобразовать в сервис, а в конструкторе инжектировать TokenStorageMap
// TokenStorageMap сделать сервисом, переименовать в TokenStorageRegistry
// добавить метод на регистрацию нового и получение зареганного
// --------------------------------
// Либо просто запровайдить текущий мап
// --------------------------------
// В TokenManagerModule.forRoot() добавить регистрацию кастомных хранилищ токенов
// --------------------------------
// ИЛИ ПРИДУМАТЬ КАК ИЗБЕЖАТЬ ДАННОГО ВЗАИМОДЕЙСТВИЯ
export class TokenStorageFactory {
	public static create(className: string): TokenStorage {
		const TokenStorage = tokenStorageMap.get(className);

		if (!TokenStorage) {
			throw new Error(`Error: this token storage class ${className} is not supported`);
		}

		return new TokenStorage();
	}
}

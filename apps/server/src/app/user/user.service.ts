import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeepPartial, Repository } from 'typeorm';
import * as uuid from 'uuid';

import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly _userRepository: Repository<UserEntity>
	) {}

	public findOne(id: number): Promise<UserEntity | undefined> {
		return this._userRepository.findOne(id);
	}

	public findByEmail(email: string): Promise<UserEntity | undefined> {
		return this._userRepository.findOne({ where: { email } });
	}

	public async create(userData: DeepPartial<UserEntity>): Promise<UserEntity> {
		if (userData.password) {
			userData.password = await bcrypt.hash(userData.password, Number(process.env.SALT_ROUNDS));
		}
		userData.confirmationLink = uuid.v4();
		const user = this._userRepository.create(userData);

		// TODO Add AutoMapper
		return this._userRepository.save(user);
	}
}

import { Injectable, NotFoundException } from '@nestjs/common';
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

	public getById(id: number): Promise<UserEntity | undefined> {
		return this._userRepository.findOne(id);
	}

	public getByEmail(email: string): Promise<UserEntity | undefined> {
		return this._userRepository.findOne({ where: { email } });
	}

	public getByConfirmationLink(confirmationLink: string): Promise<UserEntity | undefined> {
		return this._userRepository.findOne({ where: { confirmationLink } });
	}

	public async create(userData: DeepPartial<UserEntity>): Promise<UserEntity> {
		if (userData.password) {
			userData.password = await bcrypt.hash(
				userData.password,
				Number(process.env.SALT_ROUNDS)
			);
		}
		userData.confirmationLink = uuid.v4();

		return this._userRepository.create(userData);
	}

	public async issueNewConfirmationLink(id: number): Promise<UserEntity>;
	public async issueNewConfirmationLink(email: string): Promise<UserEntity>;
	public async issueNewConfirmationLink(idOrEmail: number | string): Promise<UserEntity>;
	public async issueNewConfirmationLink(idOrEmail: number | string): Promise<UserEntity> {
		let user: UserEntity | undefined;

		if (typeof idOrEmail === 'number') {
			user = await this.getById(idOrEmail);
		}

		if (typeof idOrEmail === 'string') {
			user = await this.getByEmail(idOrEmail);
		}

		if (!user) {
			throw new NotFoundException(
				`User with ${
					typeof idOrEmail === 'number' ? idOrEmail + ' id' : idOrEmail + ' email'
				} does not found`
			);
		}

		const confirmationLink = uuid.v4();
		user.confirmationLink = confirmationLink;
		await this._userRepository.update(user.id, user);

		return user;
	}

	public async createAndSave(userData: DeepPartial<UserEntity>): Promise<UserEntity> {
		const user = await this.create(userData);
		// TODO Add AutoMapper
		return this._userRepository.save(user);
	}

	public async update(id: number, userData: DeepPartial<UserEntity>): Promise<void> {
		await this._userRepository.update(id, userData);
	}
}

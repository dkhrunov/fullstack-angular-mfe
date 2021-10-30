import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@nx-mfe/shared/data-access';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly _userRepository: Repository<UserEntity>,
	) {}

	public findOne(id: number): Observable<UserEntity | undefined> {
		return from(this._userRepository.findOne(id))
			.pipe
			// map(AUTOMAPPER)
			();
	}

	public findByEmail(email: string): Observable<UserEntity | undefined> {
		return from(this._userRepository.findOne({ where: { email } }));
	}

	public create(createUserDto: CreateUserDto): Observable<UserEntity> {
		const user = this._userRepository.create(createUserDto);

		// TODO Add AutoMapper
		return from(this._userRepository.save(user)).pipe();
	}
}

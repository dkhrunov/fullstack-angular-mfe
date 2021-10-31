import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Entity({ name: 'token' })
export class TokenEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({
		type: 'varchar',
		nullable: false,
	})
	public refreshToken: string;

	@OneToOne(() => UserEntity)
	@JoinColumn()
	public user: UserEntity;

	@Column()
	public userId: number;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

	@Column()
	public userId: number;

	@ManyToOne(() => UserEntity)
	public user: UserEntity;
}

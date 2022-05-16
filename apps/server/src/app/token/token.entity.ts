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

	@Column({
		type: 'varchar',
		length: 15,
		nullable: false,
	})
	public ip: string;

	@Column({
		type: 'bigint',
		nullable: false,
	})
	public expiresIn: number;

	@Column({
		type: 'varchar',
		length: 200,
		nullable: false,
	})
	public userAgent: string;

	@Column()
	public userId: number;

	@ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
	public user: UserEntity;
}

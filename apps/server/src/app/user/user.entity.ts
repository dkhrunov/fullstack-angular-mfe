import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public email: string;

	@Column()
	public password: string;
}

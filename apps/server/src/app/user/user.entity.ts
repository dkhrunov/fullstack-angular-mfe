import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({
		type: 'varchar',
		nullable: false,
	})
	public email: string;

	@Column({
		type: 'varchar',
		nullable: false,
	})
	public password: string;

	@Column({
		type: 'boolean',
		nullable: false,
		default: false,
	})
	public isConfirmed: boolean;

	@Column({
		type: 'varchar',
		nullable: true,
	})
	public confirmationLink: string;
}

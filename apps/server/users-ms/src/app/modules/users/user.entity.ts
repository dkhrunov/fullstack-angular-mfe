import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  public email: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  public password: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  //  TODO to enum :
  // export enum UserStatus {
  //     ACTIVE = 'active',
  //     INACTIVE = 'inactive',
  //     DELETED = 'deleted'
  // }
  public isConfirmed: boolean;
}

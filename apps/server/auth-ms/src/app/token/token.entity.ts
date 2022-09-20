import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'integer', nullable: false })
  public userId: number;
}

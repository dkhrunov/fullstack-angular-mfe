import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class UserResponse {
  @IsNumber()
  @IsNotEmpty()
  public readonly id: string;

  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @IsBoolean()
  @IsNotEmpty()
  public readonly isConfirmed: boolean;

  @Exclude()
  public readonly password: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}

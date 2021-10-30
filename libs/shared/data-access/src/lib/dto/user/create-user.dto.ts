import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	public email: string;

	@IsEmail()
	@IsNotEmpty()
	public password: string;
}

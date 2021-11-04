import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CredentialsDto {
	@IsEmail()
	@IsNotEmpty()
	public email: string;

	@IsString()
	@MinLength(8)
	@IsNotEmpty()
	public password: string;
}

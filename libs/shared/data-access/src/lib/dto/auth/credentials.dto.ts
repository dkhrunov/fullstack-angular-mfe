import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CredentialsDto {
	@IsEmail()
	@IsNotEmpty()
	public email: string;

	@IsString()
	@IsNotEmpty()
	public password: string;
}

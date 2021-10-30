import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CredentialsDto {
	@IsString()
	@IsNotEmpty()
	public email: string;

	@IsEmail()
	@IsNotEmpty()
	public password: string;
}

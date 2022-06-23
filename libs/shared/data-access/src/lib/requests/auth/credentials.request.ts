import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CredentialsRequest {
	@IsEmail()
	@IsNotEmpty()
	public email: string;

	@IsString()
	@MinLength(8)
	@IsNotEmpty()
	public password: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
	@IsString()
	@IsNotEmpty()
	public email: string;

	@IsString()
	@IsNotEmpty()
	public password: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	public email: string;

	@IsString()
	@IsNotEmpty()
	public password: string;
}

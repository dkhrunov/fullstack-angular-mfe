import { IsDate, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenDto {
	@IsString()
	@IsNotEmpty()
	public token: string;

	@IsDate()
	@IsDefined()
	public expiresIn: number;
}

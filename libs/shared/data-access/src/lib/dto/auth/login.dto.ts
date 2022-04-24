import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CredentialsDto } from './credentials.dto';

export class LoginDto extends CredentialsDto {
	@IsBoolean()
	@IsNotEmpty()
	public session: boolean;
}

import { IsJWT, IsNotEmpty } from 'class-validator';

export class AuthTokensDto {
	@IsJWT()
	@IsNotEmpty()
	public accessToken: string;

	@IsJWT()
	@IsNotEmpty()
	public refreshToken: string;

	constructor(accessToken: string, refreshToken: string) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}

import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendRegistrationConfirmationMailRequest {
	@IsEmail()
	@IsNotEmpty()
	public email: string;
}

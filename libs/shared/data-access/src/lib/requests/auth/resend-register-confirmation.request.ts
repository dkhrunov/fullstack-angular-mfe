import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendRegisterConfirmationRequest {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ServerErrorDto {
	@IsString()
	@IsNotEmpty()
	public readonly error: string;

	@IsString()
	@IsNotEmpty()
	public readonly message: string;

	@IsNumber()
	@IsNotEmpty()
	public readonly statusCode: number;

	constructor(error: string, message: string, statusCode: number) {
		this.error = error;
		this.message = message;
		this.statusCode = statusCode;
	}
}

export class DefaultHttpError {
	public readonly error: string;
	public readonly message: string;
	public readonly statusCode: number;

	constructor() {
		this.error = 'Unexpected error';
		this.message = 'Something went wrong try again later';
		this.statusCode = 1000;
	}
}

export class Credentials {
	public email: string;
	public password: string;

	constructor(params: Credentials) {
		this.email = params.email;
		this.password = params.password;
	}
}

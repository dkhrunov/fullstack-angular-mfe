export class AuthTokenPayload {
	public id: number;

	public email: string;

	public isConfirmed: boolean;

	constructor(user: { id: number; email: string; isConfirmed: boolean }) {
		this.id = user.id;
		this.email = user.email;
		this.isConfirmed = user.isConfirmed;
	}
}

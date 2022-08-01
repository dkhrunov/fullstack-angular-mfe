export class AuthTokenPayload {
	public id: number;
	public email: string;
	public readonly iat: number;
	public readonly exp: number;

	constructor(user: { id: number; email: string }) {
		this.id = user.id;
		this.email = user.email;
	}
}

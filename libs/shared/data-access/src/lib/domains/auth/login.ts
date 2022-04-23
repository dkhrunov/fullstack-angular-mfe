import { Credentials } from './credentials';

export class Login extends Credentials {
	public session: boolean;

	constructor(params: Login) {
		super(params);

		this.session = params.session;
	}
}

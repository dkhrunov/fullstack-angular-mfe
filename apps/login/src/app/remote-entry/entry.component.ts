import { Component } from '@angular/core';

@Component({
	selector: 'nx-mfe-login-entry',
	template: `
		<nx-mfe-login-form></nx-mfe-login-form>
	`,
	styles: [
		`
			nx-mfe-login-form {
				display: flex;
				justify-content: center;
			}
		`
	],
})
export class RemoteEntryComponent {}

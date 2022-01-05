import { Component } from '@angular/core';

@Component({
	selector: 'nx-mfe-root',
	template: ` <router-outlet></router-outlet> `,
	styles: [
		`
			:host {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 3rem;
			}
		`,
	],
})
export class AppComponent {}

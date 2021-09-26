import { Component } from '@angular/core';

@Component({
	selector: 'nx-mfe-root',
	template: `<router-outlet></router-outlet>`,
	styles: [
		`
			:host {
				padding: 3rem;
				display: flex;
				justify-content: center;
			}
		`
	],
})
export class AppComponent {
}

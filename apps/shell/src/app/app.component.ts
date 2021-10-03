import { Component } from '@angular/core';

@Component({
	selector: 'nx-mfe-root',
	template: `
		<router-outlet></router-outlet>
	`,
	styles: [],
})
export class AppComponent {
	public readonly title = 'Admin Dashboard';
}

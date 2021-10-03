import { Component } from '@angular/core';

@Component({
	selector: 'nx-mfe-root',
	template: `
		<h2>{{ title }}d</h2>

		<router-outlet></router-outlet>
	`,
	styles: [],
})
export class AppComponent {
	public readonly title = 'Admin Dashboard';
}

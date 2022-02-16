import { Component, Injector } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
	selector: 'nx-mfe-dashboard-entry',
	template: `
		<div class="remote-entry">
			<h2 (click)="open()">dashboard's Remote Entry Component</h2>
		</div>
	`,
	styles: [
		`
			.remote-entry {
				background-color: #143055;
				color: white;
				padding: 5px;
			}
		`,
	],
})
export class EntryComponent {
	constructor(
		private readonly _drawerService: NzDrawerService,
		public readonly injector: Injector
	) {}

	public open(): void {
		this._drawerService.create({
			nzTitle: 'Template',
			nzFooter: 'Footer',
		});
	}
}

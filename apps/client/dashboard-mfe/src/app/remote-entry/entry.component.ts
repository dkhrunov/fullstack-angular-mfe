import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
	selector: 'nx-mfe-dashboard-entry',
	template: `
		<div class="remote-entry">
			<h2 (click)="open()">{{ text ? text : 'dashboard Remote Entry Component' }}</h2>
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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryComponent {
	@Input()
	public text?: string;

	constructor(private readonly _drawerService: NzDrawerService) {}

	public open(): void {
		this._drawerService.create({
			nzTitle: 'Template',
			nzFooter: 'Footer',
		});
	}
}

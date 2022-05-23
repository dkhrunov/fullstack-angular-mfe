import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

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

	@Output()
	public click = new EventEmitter<boolean>();

	constructor() {}

	public open(): void {
		this.click.emit(true);
	}
}

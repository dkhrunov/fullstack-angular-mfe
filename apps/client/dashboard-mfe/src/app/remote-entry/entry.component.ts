import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EntryService } from './entry.service';

@Component({
	selector: 'nx-mfe-dashboard-entry',
	template: `
		<div class="remote-entry">
			<h2 (click)="open()">{{ text ? text : 'Dashboard Remote Entry Component' }}</h2>
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

	constructor(private readonly _service: EntryService) {
		console.log('Value from provider, that was provided to EntryModule', this._service.data);
	}

	public open(): void {
		this.click.emit(true);
	}
}

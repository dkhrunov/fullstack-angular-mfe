import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
	selector: 'ui-logo',
	templateUrl: './logo.component.html',
	styleUrls: ['./logo.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
	@Input()
	public size: '16' | '20' | '24' | '32' = '16';
}

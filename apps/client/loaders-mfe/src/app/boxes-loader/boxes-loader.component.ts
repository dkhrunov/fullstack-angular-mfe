import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'nx-mfe-boxes-loader',
	templateUrl: './boxes-loader.component.html',
	styleUrls: ['./boxes-loader.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxesLoaderComponent {}

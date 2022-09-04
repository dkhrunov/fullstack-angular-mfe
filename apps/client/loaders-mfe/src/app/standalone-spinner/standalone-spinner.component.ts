import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'carbon-components-angular/loading';

@Component({
	selector: 'nx-mfe-standalone-spinner',
	standalone: true,
	imports: [CommonModule, LoadingModule],
	template: `
		<div class="container">
			<ibm-loading [isActive]="isActive" [size]="size"></ibm-loading>
		</div>
	`,
	styles: [
		`
			.container {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandaloneSpinnerComponent {
	@Input()
	public isActive = true;

	@Input()
	public size: 'normal' | 'sm' = 'normal';
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'nx-mfe-spinner',
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
export class SpinnerComponent {
	@Input()
	public isActive = true;

	@Input()
	public size: 'normal' | 'sm' = 'normal';
}

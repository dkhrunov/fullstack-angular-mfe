import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'nx-mfe-default',
	template: `
		<div class="container">
			<nz-spin nzSimple nzSize="large"></nz-spin>
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
export class SpinnerComponent {}

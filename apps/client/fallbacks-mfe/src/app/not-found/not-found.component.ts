import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'nx-mfe-not-found',
	template: `
		<nz-result
			nzStatus="404"
			nzTitle="404"
			nzSubTitle="Sorry, the page you visited does not exist."
		>
			<div nz-result-extra>
				<button nz-button nzType="primary" routerLink="/">Back Home</button>
			</div>
		</nz-result>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}

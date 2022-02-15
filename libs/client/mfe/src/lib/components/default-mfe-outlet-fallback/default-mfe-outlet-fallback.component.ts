import { Component } from '@angular/core';

@Component({
	selector: 'nx-mfe-mfe-outlet-fallback',
	template: `
		<nz-result
			nzStatus="error"
			nzTitle="Submission Failed"
			nzSubTitle="Please check and modify the following information before resubmitting."
			[nzIcon]="icon"
		>
			<ng-template #icon>
				<i nz-icon nzType="api" nzTheme="twotone" nzTwotoneColor="#303030ee"></i>
			</ng-template>
		</nz-result>
	`,
})
export class DefaultMfeOutletFallbackComponent {}

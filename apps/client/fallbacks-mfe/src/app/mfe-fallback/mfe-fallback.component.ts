import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'nx-mfe-client-fallbacks-mfe-entry',
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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MfeFallbackComponent {}

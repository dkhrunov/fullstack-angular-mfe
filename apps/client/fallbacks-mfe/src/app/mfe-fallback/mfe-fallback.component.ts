import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'nx-mfe-client-fallbacks-mfe-entry',
	template: `
		<h3>MFE Fallback</h3>
		<p>Something went wrong</p>
		<!-- <nz-result
			nzStatus="error"
			nzTitle="Something went wrong"
			nzSubTitle="Try reloading the page or contact support."
			[nzIcon]="icon"
		>
			<ng-template #icon>
				<i nz-icon nzType="api" nzTheme="twotone" nzTwotoneColor="#303030ee"></i>
			</ng-template>
		</nz-result> -->
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MfeFallbackComponent {}

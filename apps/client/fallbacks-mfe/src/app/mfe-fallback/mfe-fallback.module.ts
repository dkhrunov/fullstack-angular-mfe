import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';

import { MfeFallbackComponent } from './mfe-fallback.component';

@NgModule({
	declarations: [MfeFallbackComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: MfeFallbackComponent,
			},
		]),
		NzResultModule,
		NzIconModule,
	],
	exports: [MfeFallbackComponent],
})
export class MfeFallbackModule {}

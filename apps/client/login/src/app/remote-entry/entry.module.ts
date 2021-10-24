import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginFormModule } from '@nx-mfe/auth-login-form';

import { RemoteEntryComponent } from './entry.component';

@NgModule({
	declarations: [RemoteEntryComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: RemoteEntryComponent,
			},
		]),
		LoginFormModule,
	],
	providers: [],
})
export class RemoteEntryModule {}

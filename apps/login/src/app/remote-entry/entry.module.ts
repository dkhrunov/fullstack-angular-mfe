import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RemoteEntryComponent } from './entry.component';
import { LoginFormModule } from '@nx-mfe/login/form';

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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
	],
	providers: [],
})
export class RemoteEntryModule {}

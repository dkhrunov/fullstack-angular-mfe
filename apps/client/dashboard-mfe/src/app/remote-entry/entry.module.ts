import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EntryComponent } from './entry.component';

@NgModule({
	declarations: [EntryComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: EntryComponent,
			},
		]),
	],
	providers: [],
})
export class EntryModule {}

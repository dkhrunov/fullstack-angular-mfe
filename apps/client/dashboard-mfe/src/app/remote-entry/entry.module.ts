import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EntryComponent } from './entry.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: EntryComponent,
			},
		]),
	],
	declarations: [EntryComponent],
	exports: [EntryComponent],
})
export class EntryModule {}

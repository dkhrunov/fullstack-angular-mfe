import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EntryComponent } from './entry.component';
import { EntryService } from './entry.service';

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
	providers: [EntryService],
	declarations: [EntryComponent],
	exports: [EntryComponent],
})
export class EntryModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found.component';

@NgModule({
	declarations: [NotFoundComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: NotFoundComponent,
			},
		]),
	],
	exports: [NotFoundComponent],
})
export class NotFoundModule {}

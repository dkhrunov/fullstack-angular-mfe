import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
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
		NzResultModule,
		NzButtonModule,
	],
	exports: [NotFoundComponent],
})
export class NotFoundModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

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
		ReactiveFormsModule,
		NzFormModule,
		NzButtonModule,
		NzIconModule,
		NzInputModule,
		NzCheckboxModule,
		NzAlertModule,
	],
})
export class RemoteEntryModule {}

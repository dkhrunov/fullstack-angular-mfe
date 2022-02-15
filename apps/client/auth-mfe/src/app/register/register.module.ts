import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MfeModule } from '@nx-mfe/client/mfe';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { RegisterComponent } from './register.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: RegisterComponent,
			},
		]),
		ReactiveFormsModule,
		MfeModule,
		NzButtonModule,
		NzFormModule,
		NzInputModule,
		NzTypographyModule,
		NzIconModule,
		NzAlertModule,
	],
	declarations: [RegisterComponent],
	exports: [RegisterComponent],
})
export class RegisterModule {}

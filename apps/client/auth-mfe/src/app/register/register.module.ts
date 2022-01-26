import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { RegisterComponent } from './register.component';

@NgModule({
	declarations: [RegisterComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: '',
				component: RegisterComponent,
			},
		]),
		ReactiveFormsModule,
		NzButtonModule,
		NzFormModule,
		NzInputModule,
		NzTypographyModule,
		NzIconModule,
	],
})
export class RegisterModule {}

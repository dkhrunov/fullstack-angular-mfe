import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

import { AuthLoginFormComponent } from './login-form.component';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NzFormModule,
		NzButtonModule,
		NzIconModule,
		NzInputModule,
		NzCheckboxModule,
		NzAlertModule,
	],
	declarations: [AuthLoginFormComponent],
	exports: [AuthLoginFormComponent],
})
export class LoginFormModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LoginFormComponent } from './login-form.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAlertModule } from 'ng-zorro-antd/alert';

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
	declarations: [LoginFormComponent],
	exports: [LoginFormComponent],
})
export class LoginFormModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// import { RouterModule } from '@angular/router';
import { BoxesLoaderComponent } from './boxes-loader.component';

@NgModule({
	imports: [
		CommonModule,
		// RouterModule.forChild([
		// 	{
		// 		path: '',
		// 		component: BoxesLoaderComponent,
		// 	},
		// ]),
	],
	declarations: [BoxesLoaderComponent],
	exports: [BoxesLoaderComponent],
})
export class BoxesLoaderModule {}

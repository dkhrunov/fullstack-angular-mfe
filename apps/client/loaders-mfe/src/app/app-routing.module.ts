import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StandaloneSpinnerComponent } from './standalone-spinner/standalone-spinner.component';

const routes: Routes = [
	{
		path: 'spinner',
		loadChildren: () => import('./spinner/spinner.module').then((m) => m.SpinnerModule),
	},
	{
		path: 'standalone-spinner',
		component: StandaloneSpinnerComponent,
	},
	{
		path: '**',
		redirectTo: 'spinner',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}

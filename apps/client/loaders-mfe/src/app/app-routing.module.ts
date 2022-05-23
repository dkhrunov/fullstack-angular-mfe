import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'boxes-loader',
		loadChildren: () =>
			import('./boxes-loader/boxes-loader.module').then((m) => m.BoxesLoaderModule),
	},
	{
		path: 'spinner',
		loadChildren: () => import('./spinner/spinner.module').then((m) => m.SpinnerModule),
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

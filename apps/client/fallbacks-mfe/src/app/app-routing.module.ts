import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'mfe-fallback',
		loadChildren: () =>
			import('./mfe-fallback/mfe-fallback.module').then((m) => m.MfeFallbackModule),
	},
	{
		path: '**',
		redirectTo: 'mfe-fallback',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}

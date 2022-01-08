import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'auth',
		children: [
			{
				path: 'login',
				loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
			},
			{
				path: 'register',
				loadChildren: () =>
					import('./register/register.module').then((m) => m.RegisterModule),
			},
			{
				path: '**',
				redirectTo: 'login',
			},
		],
	},
	{
		path: '**',
		redirectTo: '/auth/login',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}

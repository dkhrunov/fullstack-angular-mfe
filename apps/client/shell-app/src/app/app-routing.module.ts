import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, UnAuthGuard } from '@nx-mfe/client/auth';
import { loadMfe } from '@nx-mfe/client/mfe';

const routes: Routes = [
	{
		path: 'auth',
		children: [
			{
				path: 'login',
				loadChildren: () => loadMfe('auth-mfe/login'),
				canLoad: [UnAuthGuard],
				canActivate: [UnAuthGuard],
			},
			{
				path: 'register',
				loadChildren: () => loadMfe('auth-mfe/register'),
				canLoad: [UnAuthGuard],
				canActivate: [UnAuthGuard],
			},
			{
				path: '**',
				redirectTo: '/dashboard',
			},
		],
	},
	{
		path: 'dashboard',
		loadChildren: () => loadMfe('dashboard-mfe/entry'),
		canLoad: [AuthGuard],
		canActivate: [AuthGuard],
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/dashboard',
	},
	// TODO: add 404 page
	{
		path: '**',
		redirectTo: '/dashboard',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}

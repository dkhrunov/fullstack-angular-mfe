import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, UnAuthGuard } from '@nx-mfe/client/auth';
import { loadMfeModule } from '@nx-mfe/client/mfe';

const routes: Routes = [
	{
		path: 'auth',
		children: [
			{
				path: 'login',
				loadChildren: () => loadMfeModule('client-auth-mfe/login'),
				canLoad: [UnAuthGuard],
				canActivate: [UnAuthGuard],
			},
			{
				path: 'register',
				loadChildren: () => loadMfeModule('client-auth-mfe/register'),
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
		loadChildren: () => loadMfeModule('client-dashboard-mfe/entry'),
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

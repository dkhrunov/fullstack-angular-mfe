import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, UnAuthGuard } from '@dekh/ngx-jwt-auth';
import { loadRemoteModule } from '@nrwl/angular/mfe';
import { loadMfe } from '@nx-mfe/client/mfe';

const routes: Routes = [
	{
		path: 'auth',
		children: [
			{
				path: 'login',
				loadChildren: () => loadMfe('client-auth-mfe/login'),
				canLoad: [UnAuthGuard],
				canActivate: [UnAuthGuard],
			},
			{
				path: 'register',
				loadChildren: () => loadMfe('client-auth-mfe/register'),
				canLoad: [UnAuthGuard],
				canActivate: [UnAuthGuard],
			},
		],
	},
	{
		path: 'dashboard',
		loadChildren: () =>
			loadRemoteModule('client-dashboard-mfe', 'Entry').then((m) => m.EntryModule),
		canLoad: [AuthGuard],
		canActivate: [AuthGuard],
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/dashboard',
	},
	{
		path: '**',
		loadChildren: () => loadMfe('client-fallbacks-mfe/not-found'),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}

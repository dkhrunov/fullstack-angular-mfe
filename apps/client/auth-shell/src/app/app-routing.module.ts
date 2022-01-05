import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { UnauthGuard } from '@nx-mfe/client-auth';

const routes: Routes = [
	{
		path: 'auth',
		children: [
			{
				path: 'login',
				loadChildren: () =>
					loadRemoteModule({
						remoteEntry: 'http://localhost:4201/remoteEntry.js',
						remoteName: 'login',
						exposedModule: 'EntryModule',
					}).then((m) => m.RemoteEntryModule),
				canLoad: [UnauthGuard],
				canActivate: [UnauthGuard],
			},
			// {
			// 	path: 'register',
			// },
			{
				path: '**',
				redirectTo: '/auth/login',
			},
		],
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/auth/login',
	},
	// TODO: add 404 page
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

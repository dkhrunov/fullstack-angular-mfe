import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { AuthGuard } from '@nx-mfe/client-auth';

const routes: Routes = [
	// {
	// 	path: 'auth',
	// 	children: [
	// 		{
	// 			path: 'login',
	// 			loadChildren: () =>
	// 				loadRemoteModule({
	// 					remoteEntry: 'http://localhost:4201/remoteEntry.js',
	// 					remoteName: 'login',
	// 					exposedModule: 'EntryModule',
	// 				}).then((m) => m.RemoteEntryModule),
	// 			canLoad: [UnauthGuard],
	// 			canActivate: [UnauthGuard],
	// 		},
	// 		// {
	// 		// 	path: 'register',
	// 		// },
	// 		{
	// 			path: '**',
	// 			redirectTo: '/dashboard',
	// 		},
	// 	],
	// },
	{
		path: 'dashboard',
		loadChildren: () =>
			loadRemoteModule({
				remoteEntry: 'http://localhost:4202/remoteEntry.js',
				remoteName: 'dashboard',
				exposedModule: 'EntryModule',
			}).then((m) => m.RemoteEntryModule),
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

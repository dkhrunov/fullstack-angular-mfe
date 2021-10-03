import { loadRemoteModule } from '@angular-architects/module-federation';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthorizedGuard } from './guards/authorized.guard';
import { UnauthorizedGuard } from './guards/unauthorized.guard';

const routes: Routes = [
	{
		path: 'login',
		loadChildren: () =>
			loadRemoteModule({
				remoteEntry: 'http://localhost:4201/remoteEntry.js',
				remoteName: 'login',
				exposedModule: './Module',
			}).then((m) => m.RemoteEntryModule),
		canActivate: [UnauthorizedGuard],
	},
	{
		path: 'dashboard',
		loadChildren: () =>
			loadRemoteModule({
				remoteEntry: 'http://localhost:4202/remoteEntry.js',
				remoteName: 'dashboard',
				exposedModule: './Module',
			}).then((m) => m.RemoteEntryModule),
		canActivate: [AuthorizedGuard],
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'dashboard',
	},
	// TODO: add 404 page
	{
		path: '**',
		redirectTo: 'dashboard',
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}

import { loadRemoteModule } from '@angular-architects/module-federation';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
	{
		path: 'login',
		loadChildren: () => loadRemoteModule({
			remoteEntry: 'http://localhost:4201/remoteEntry.js',
			remoteName: 'login',
			exposedModule: './Module',
		}).then((m) => m.RemoteEntryModule),
	},
	{
		path: 'dashboard',
		loadChildren: () =>	loadRemoteModule({
			remoteEntry: 'http://localhost:4202/remoteEntry.js',
			remoteName: 'dashboard',
			exposedModule: './Module',
		}).then((m) => m.RemoteEntryModule),
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login',
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}

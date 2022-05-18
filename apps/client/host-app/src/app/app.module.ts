import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { loadRemoteModule } from '@nrwl/angular/mfe';

@NgModule({
	declarations: [AppComponent, NxWelcomeComponent],
	imports: [
		BrowserModule,
		RouterModule.forRoot(
			[
				{
					path: '',
					component: NxWelcomeComponent,
				},
				{
					path: 'client-first',
					loadChildren: () =>
						loadRemoteModule('client-first', './Module').then(
							(m) => m.RemoteEntryModule
						),
				},
				{
					path: 'client-second',
					loadChildren: () =>
						loadRemoteModule('client-second', './Module').then(
							(m) => m.RemoteEntryModule
						),
				},
			],
			{ initialNavigation: 'enabledBlocking' }
		),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}

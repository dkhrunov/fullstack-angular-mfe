import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ClientCoreModule } from '@nx-mfe/client/core';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(
			[
				{
					path: '',
					loadChildren: () =>
						import('./remote-entry/entry.module').then((m) => m.EntryModule),
				},
			],
			{ initialNavigation: 'enabledBlocking' }
		),
		ClientCoreModule.forApp(environment),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
						import('./remote-entry/entry.module').then(
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

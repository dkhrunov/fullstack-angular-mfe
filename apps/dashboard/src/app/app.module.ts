import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		RouterModule.forRoot(
			[
				{
					path: 'login',
					loadChildren: () =>
						loadRemoteModule({
							remoteEntry: 'http://localhost:4201/remoteEntry.js',
							remoteName: 'login',
							exposedModule: './Module',
						}).then((m) => m.RemoteEntryModule),
				},
			],
			{ initialNavigation: 'enabledBlocking' }
		),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {
}

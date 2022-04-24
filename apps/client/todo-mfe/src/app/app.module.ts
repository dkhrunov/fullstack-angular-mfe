/*
 * This RemoteEntryModule is imported here to allow TS to find the Module during
 * compilation, allowing it to be included in the built bundle. This is required
 * for the Module Federation Plugin to expose the Module correctly.
 * */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RemoteEntryModule } from './remote-entry/entry.module';

@NgModule({
	declarations: [AppComponent, NxWelcomeComponent],
	imports: [
		BrowserModule,
		RemoteEntryModule,
		RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}

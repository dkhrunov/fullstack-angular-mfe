import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './logo.component';
import {
	IbmZCloudModStack16,
	IbmZCloudModStack20,
	IbmZCloudModStack24,
	IbmZCloudModStack32,
	// @ts-ignore
} from '@carbon/icons';
import { IconModule, IconService } from 'carbon-components-angular/icon';

@NgModule({
	declarations: [LogoComponent],
	imports: [CommonModule, IconModule],
	exports: [LogoComponent],
})
export class LogoModule {
	constructor(private readonly _iconService: IconService) {
		this._iconService.registerAll([
			IbmZCloudModStack16,
			IbmZCloudModStack20,
			IbmZCloudModStack24,
			IbmZCloudModStack32,
		]);
	}
}

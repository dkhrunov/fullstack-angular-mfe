import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TilesModule } from 'carbon-components-angular/tiles';

import { CardComponent } from './card.component';
import { CardContentDirective } from './card-content.directive';
import { CardFooterDirective } from './card-footer.directive';
import { CardHeaderDirective } from './card-header.directive';
import { CardSubtitleDirective } from './card-subtitle.directive';
import { CardTitleDirective } from './card-title.directive';

@NgModule({
	imports: [CommonModule, TilesModule],
	declarations: [
		CardComponent,
		CardHeaderDirective,
		CardTitleDirective,
		CardSubtitleDirective,
		CardFooterDirective,
		CardContentDirective,
	],
	exports: [
		CardComponent,
		CardHeaderDirective,
		CardTitleDirective,
		CardSubtitleDirective,
		CardFooterDirective,
		CardContentDirective,
	],
})
export class CardModule {}

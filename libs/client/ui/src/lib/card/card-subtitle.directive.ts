import { Directive, HostBinding } from '@angular/core';

@Directive({
	selector: 'ui-card-subtitle',
})
export class CardSubtitleDirective {
	@HostBinding('class.ui-card__subtitle') public baseClass = true;
}

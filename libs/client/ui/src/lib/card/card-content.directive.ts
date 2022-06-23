import { Directive, HostBinding } from '@angular/core';

@Directive({
	selector: 'ui-card-content',
})
export class CardContentDirective {
	@HostBinding('class.ui-card__content') public baseClass = true;
}

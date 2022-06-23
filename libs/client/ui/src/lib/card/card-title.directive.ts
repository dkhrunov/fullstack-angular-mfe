import { Directive, HostBinding } from '@angular/core';

@Directive({
	selector: 'ui-card-title',
})
export class CardTitleDirective {
	@HostBinding('class.ui-card__title') public baseClass = true;
}

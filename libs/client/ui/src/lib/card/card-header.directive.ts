import { Directive, HostBinding } from '@angular/core';

@Directive({
	selector: 'ui-card-header',
})
export class CardHeaderDirective {
	@HostBinding('class.ui-card__header') public baseClass = true;
}

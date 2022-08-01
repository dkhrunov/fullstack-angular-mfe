import { Directive, HostBinding } from '@angular/core';

@Directive({
	selector: 'ui-card-footer',
})
export class CardFooterDirective {
	@HostBinding('class.ui-card__footer') public baseClass = true;
}

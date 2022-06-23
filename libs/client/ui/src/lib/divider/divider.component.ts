import {
	Component,
	ChangeDetectionStrategy,
	Input,
	HostBinding,
	ViewEncapsulation,
} from '@angular/core';
import { BooleanInput, CoerceBoolean } from '@nx-mfe/client/common';

@Component({
	selector: 'ui-divider',
	template: ``,
	styleUrls: ['./divider.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerComponent {
	@Input()
	@CoerceBoolean()
	@HostBinding('class.ui-divider--vertical')
	public vertical: BooleanInput = false;

	@HostBinding('class.ui-divider') public baseClass = 'ui-divider';
}

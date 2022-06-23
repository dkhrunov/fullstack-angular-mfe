import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { BaseModal } from 'carbon-components-angular/modal';
import { finalize, map, Observable, take, timer } from 'rxjs';

@Component({
	selector: 'nx-mfe-confirm-registration-modal',
	templateUrl: './confirm-registration-modal.component.html',
	styleUrls: ['./confirm-registration-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmRegistrationModalComponent extends BaseModal {
	@Output()
	public readonly send = new EventEmitter();

	public countdown: Observable<number> | null = null;

	constructor(@Inject('email') public readonly email: string) {
		super();
	}

	public sendAgain(): void {
		this.send.emit();
		this._startCountdown();
	}

	private _startCountdown(): void {
		const DELAY_IN_SECONDS = 30;

		this.countdown = timer(0, 1000).pipe(
			map((i) => DELAY_IN_SECONDS - i),
			take(DELAY_IN_SECONDS + 1),
			finalize(() => (this.countdown = null))
		);
	}
}

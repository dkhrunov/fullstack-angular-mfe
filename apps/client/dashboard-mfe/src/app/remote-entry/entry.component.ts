import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { JwtAuthService } from '@dekh/ngx-jwt-auth';
import { EntryService } from './entry.service';

@Component({
	selector: 'nx-mfe-dashboard-entry',
	template: `
		<div class="remote-entry">
			<h2 (click)="open()">{{ text ? text : 'Dashboard Remote Entry Component' }}</h2>
			<div class="actions">
				<span>
					<a [routerLink]="['/not-work']">Go to something</a>
				</span>
				<span>
					<a (click)="logout()">Log Out</a>
				</span>
			</div>
		</div>
	`,
	styles: [
		`
			.remote-entry {
				background-color: #143055;
				color: white;
				padding: 5px;
			}

			.actions {
				display: flex;
				align-items: center;
				gap: 1rem;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryComponent {
	@Input()
	public text?: string;

	@Output()
	public click = new EventEmitter<boolean>();

	constructor(
		private readonly _router: Router,
		private readonly _service: EntryService,
		private readonly _jwtAuthService: JwtAuthService
	) {
		console.log('Value from provider, that was provided to EntryModule', this._service.data);
	}

	public open(): void {
		this.click.emit(true);
	}

	public logout(): void {
		this._jwtAuthService.logout().subscribe(() => this._router.navigateByUrl('/auth/login'));
	}
}

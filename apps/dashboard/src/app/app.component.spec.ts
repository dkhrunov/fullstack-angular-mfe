import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UserService } from '@nx-mfe/shared/data-access-user';

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [AppComponent],
			providers: [
				UserService,
				{ provide: ComponentFixtureAutoDetect, useValue: true },
			],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;

		expect(app).toBeTruthy();
	});

	it('should render page title', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const component = fixture.componentInstance;
		const h2 = fixture.nativeElement.querySelector('h2');

		expect(h2.textContent).toContain(component.title);
	});

	it('should go to home url if user authorize', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const service = TestBed.inject(UserService);
		const location: Location = TestBed.inject(Location);
		Object.defineProperty(service, 'isUserLoggedIn$', {
			value: of(false),
		});
		fixture.detectChanges();

		expect(location.path()).toEqual('');
	});

	it('should go to login url if user dont authorize', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const location: Location = TestBed.inject(Location);
		const component = fixture.componentInstance;
		Object.defineProperty(component, 'isLoggedIn$', {
			value: of(false),
		});
		fixture.detectChanges();

		expect(location.path()).toEqual('/login');
	});
});

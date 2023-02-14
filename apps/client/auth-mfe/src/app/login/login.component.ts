import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Form, IfFormValid } from '@nx-mfe/client/forms';
import { PasswordInputComponent } from '@nx-mfe/client/ui';
import { LoginRequest } from '@nx-mfe/shared/data-access';
import { plainToInstance } from 'class-transformer';
import { BehaviorSubject, Subject, takeUntil, timer } from 'rxjs';

import { LoginFacadeService } from './login-facade.service';

@Component({
  selector: 'nx-mfe-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginFacadeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideLeft', [
      state('*', style({ opacity: 0, transform: 'translate3d(100%, 0, 0)' })),
      state('in', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' })),
      state('out', style({ opacity: 0, transform: 'translate3d(-100%, 0, 0)' })),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [animate('300ms 50ms ease-out')]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave', animate('300ms 0ms ease-in')),
    ]),
    trigger('slideRight', [
      state('*', style({ opacity: 0, transform: 'translate3d(-100%, 0, 0)' })),
      state('in', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' })),
      state('out', style({ opacity: 0, transform: 'translate3d(100%, 0, 0)' })),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [animate('300ms 50ms ease-out')]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave', animate('300ms 0ms ease-in')),
    ]),
    trigger('shakeX', [
      state('*', style({ transform: 'translate3d(0, 0, 0)' })),
      transition(':enter', [
        animate(
          '300ms',
          keyframes([
            style({ transform: 'translate3d(-15px, 0, 0)' }),
            style({ transform: 'translate3d(15px, 0, 0)' }),
            style({ transform: 'translate3d(-10px, 0, 0)' }),
            style({ transform: 'translate3d(10px, 0, 0)' }),
            style({ transform: 'translate3d(-5px, 0, 0)' }),
            style({ transform: 'translate3d(5px, 0, 0)' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  @Form()
  public form: UntypedFormGroup;

  @ViewChild('emailInput')
  public emailInput: ElementRef<HTMLInputElement>;

  @ViewChild('passwordInput')
  public passwordInput: PasswordInputComponent;

  // TODO удалить тестовые данные
  public readonly text$ = new BehaviorSubject<string>('Test string');

  private readonly _logInStep$ = new BehaviorSubject<number>(0);
  public readonly logInStep$ = this._logInStep$.asObservable();

  private readonly _destroy$ = new Subject<void>();

  public get emailControl(): AbstractControl | null {
    return this.form.get('email');
  }

  public get passwordControl(): AbstractControl | null {
    return this.form.get('password');
  }

  constructor(
    public readonly loginFacade: LoginFacadeService,
    private readonly _fb: UntypedFormBuilder
  ) {
    this._createForm();

    // TODO удалить тестовые данные
    setTimeout(() => this.text$.next('Test string changed 1x in Subject'), 2000);
    // TODO удалить тестовые данные
    setTimeout(() => this.text$.next('Test string changed 2x in Subject'), 3000);
  }

  public ngAfterViewInit(): void {
    this.emailInput.nativeElement.focus();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  // TODO удалить тестовые данные
  public onClick(bool: MouseEvent): void {
    console.log('login', bool);
  }

  @IfFormValid()
  public logIn(): void {
    const credentials = plainToInstance(LoginRequest, this.form.value);
    this.loginFacade.logIn(credentials);
  }

  public forwardToPassword(): void {
    if (this.emailControl?.valid) {
      this._nextStep();
      // HACK 400ms - animation delay
      timer(400)
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => this.passwordInput.focus());
    } else {
      this.emailControl?.markAsTouched();
    }
  }

  public backToEmail(): void {
    this._prevStep();
    this.passwordControl?.reset();
    this.loginFacade.resetLogInError();

    // HACK 400ms - animation delay
    timer(400)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.emailInput.nativeElement.focus();
        this.emailInput.nativeElement.select();
      });
  }

  private _prevStep(): void {
    if (this._logInStep$.value === 0) return;
    this._logInStep$.next(this._logInStep$.value - 1);
  }

  private _nextStep(): void {
    this._logInStep$.next(this._logInStep$.value + 1);
  }

  private _createForm(): void {
    this.form = this._fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      session: [false],
    });
  }
}

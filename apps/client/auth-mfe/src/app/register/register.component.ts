import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PASSWORD_REGEXP } from '@nx-mfe/client/auth';
import { Form, IfFormValid } from '@nx-mfe/client/forms';
import { RegisterRequest } from '@nx-mfe/shared/data-access';
import { plainToClass } from 'class-transformer';

import { RegisterFacadeService } from './register-facade.service';

@Component({
  selector: 'nx-mfe-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [RegisterFacadeService],
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
  ],
})
export class RegisterComponent implements AfterViewInit {
  @Form()
  public form: UntypedFormGroup;

  @ViewChild('emailInput')
  public emailInput: ElementRef<HTMLInputElement>;

  public readonly passwordTests: RegExp[] = [/[@$!%*#?&]/, /[a-zA-z]/, /[0-9]/];
  public readonly passwordMinlength: number = 8;

  public get emailControl(): AbstractControl | null {
    return this.form.get('email');
  }
  public get passwordControl(): AbstractControl | null {
    return this.form.get('password');
  }
  public get passwordConfirmControl(): AbstractControl | null {
    return this.form.get('passwordConfirm');
  }

  constructor(
    public readonly registerFacade: RegisterFacadeService,
    private readonly _fb: UntypedFormBuilder
  ) {
    this._createForm();
  }

  public ngAfterViewInit(): void {
    this.emailInput.nativeElement.focus();
  }

  @IfFormValid()
  public register(): void {
    const credentials = plainToClass(RegisterRequest, this.form.value);
    this.registerFacade.register(credentials);
  }

  private _createForm(): void {
    this.form = this._fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(this.passwordMinlength),
          Validators.pattern(PASSWORD_REGEXP),
        ],
      ],
    });
  }
}

import { Controller, Inject } from '@nestjs/common';
import { MailMs, Utils } from '@nx-mfe/server/grpc';
import { Observable } from 'rxjs';

import { IMailService } from '../abstractions';
import { Services } from '../constants';

@Controller()
@MailMs.MailServiceControllerMethods()
export class MailController implements MailMs.MailServiceController {
  constructor(@Inject(Services.MAIL_SERVICE) private readonly _service: IMailService) {}

  // BUG переименовать в sendActivateAccountEmail и переименовать template
  public confirmRegistration(
    request: MailMs.ConfirmRegistrationRequest
  ): Utils.Empty | Promise<Utils.Empty> | Observable<Utils.Empty> {
    return this._service.confirmRegistration(request.recipient, request.token);
  }
}

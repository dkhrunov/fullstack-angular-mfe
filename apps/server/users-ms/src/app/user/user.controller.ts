import { Controller, Inject } from '@nestjs/common';
import { UsersMs } from '@nx-mfe/server/grpc';
import { Observable } from 'rxjs';

import { IUserService } from '../abstractions';
import { Services } from '../constants';

@Controller()
@UsersMs.UsersServiceControllerMethods()
export class UserController implements UsersMs.UsersServiceController {
  constructor(@Inject(Services.USER_SERVICE) private readonly _service: IUserService) {}

  public findOne(
    request: UsersMs.FindOneRequest
  ): UsersMs.User | Promise<UsersMs.User> | Observable<UsersMs.User> {
    return this._service.findOne(request).then((user) => UsersMs.User.fromJSON(user));
  }

  public create(
    request: UsersMs.CreateRequest
  ): UsersMs.User | Promise<UsersMs.User> | Observable<UsersMs.User> {
    return this._service.create(request).then((user) => UsersMs.User.fromJSON(user));
  }

  public update(
    request: UsersMs.UpdateRequest
  ): UsersMs.User | Promise<UsersMs.User> | Observable<UsersMs.User> {
    return this._service.update(request.id, request).then((user) => UsersMs.User.fromJSON(user));
  }

  public delete(
    request: UsersMs.DeleteRequest
  ): UsersMs.DeleteResponse | Promise<UsersMs.DeleteResponse> | Observable<UsersMs.DeleteResponse> {
    return this._service
      .delete(request.id)
      .then(() => UsersMs.DeleteResponse.fromJSON({ id: request.id }));
  }

  public issueNewConfirmationLink(
    request: UsersMs.IssueNewConfirmationLinkRequest
  ):
    | UsersMs.IssueNewConfirmationLinkResponse
    | Promise<UsersMs.IssueNewConfirmationLinkResponse>
    | Observable<UsersMs.IssueNewConfirmationLinkResponse> {
    return this._service
      .issueNewConfirmationLink(request.email)
      .then((link) => UsersMs.IssueNewConfirmationLinkResponse.fromJSON({ link }));
  }
}

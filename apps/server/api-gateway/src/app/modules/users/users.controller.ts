import { Controller, Get, Inject, OnModuleInit, Param, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UsersMs } from '@nx-mfe/server/grpc';
import { mapToInstance } from '@nx-mfe/shared/common';
import { UserResponse } from '@nx-mfe/shared/data-access';
import { Observable } from 'rxjs';

import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController implements OnModuleInit {
  private _usersMs: UsersMs.UsersServiceClient;

  constructor(@Inject(UsersMs.USERS_SERVICE_NAME) private readonly _client: ClientGrpc) {}

  public onModuleInit() {
    this._usersMs = this._client.getService<UsersMs.UsersServiceClient>(UsersMs.USERS_SERVICE_NAME);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  public getOne(@Param('id') id: string): Observable<UserResponse | undefined> {
    return this._usersMs
      .findOne(UsersMs.FindOneRequest.fromPartial({ id: parseInt(id) }))
      .pipe(mapToInstance(UserResponse));
  }
}

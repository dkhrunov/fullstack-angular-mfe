import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UsersMs } from '@nx-mfe/server/grpc';
import { Observable } from 'rxjs';

@Controller('users')
export class UsersController implements OnModuleInit {
  private _usersMs: UsersMs.UsersServiceClient;

  constructor(@Inject(UsersMs.USERS_SERVICE_NAME) private readonly _client: ClientGrpc) {}

  public onModuleInit() {
    this._usersMs = this._client.getService<UsersMs.UsersServiceClient>(UsersMs.USERS_SERVICE_NAME);
  }

  @Get('/:id')
  public getOne(@Param('id') id: string): Observable<UsersMs.User | undefined> {
    return this._usersMs.findOne(UsersMs.FindOneRequest.fromPartial({ id: parseInt(id) }));
  }
}

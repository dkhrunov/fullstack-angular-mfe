import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailMs, UsersMs } from '@nx-mfe/server/grpc';
import { join } from 'path';

import { Services } from '../../constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const AUTH_SERVICE_PROVIDER = {
  provide: Services.AUTH_SERVICE,
  useClass: AuthService,
};

@Module({
  imports: [
    ClientsModule.register([
      {
        name: UsersMs.USERS_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          // TODO service discovery
          url: '0.0.0.0:3002',
          package: UsersMs.USERS_PACKAGE_NAME,
          // TODO монжо вынести в npm пакет,
          // но тогда придется публиковать пакет при каждом изменении,
          // пока что пусть будет такой путь для удобства разработки
          protoPath: join(process.cwd(), 'libs/server/grpc/src/lib/proto/users-ms.proto'),
        },
      },
      {
        name: MailMs.MAIL_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          // TODO service discovery
          url: '0.0.0.0:3003',
          package: MailMs.MAIL_PACKAGE_NAME,
          // TODO монжо вынести в npm пакет,
          // но тогда придется публиковать пакет при каждом изменении,
          // пока что пусть будет такой путь для удобства разработки
          protoPath: join(process.cwd(), 'libs/server/grpc/src/lib/proto/mail-ms.proto'),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AUTH_SERVICE_PROVIDER],
})
export class AuthModule {}

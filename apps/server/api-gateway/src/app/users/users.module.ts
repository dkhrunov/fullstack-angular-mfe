import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersMs } from '@nx-mfe/server/grpc';

import { UsersController } from './users.controller';

@Module({
  imports: [
    ClientsModule.register([
      // TODO вынести в отдельную константу
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
          protoPath: 'libs/server/grpc/src/lib/proto/users-ms.proto',
        },
      },
    ]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { AuthMs } from '@nx-mfe/server/grpc';
import { join } from 'path';

import { AuthController } from './auth.controller';
import { AuthStrategy } from './auth.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    ClientsModule.register([
      // TODO вынести в отдельную константу
      {
        name: AuthMs.AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          // TODO service discovery
          url: '0.0.0.0:3001',
          package: AuthMs.AUTH_PACKAGE_NAME,
          // TODO монжо вынести в npm пакет,
          // но тогда придется публиковать пакет при каждом изменении,
          // пока что пусть будет такой путь для удобства разработки
          protoPath: join(process.cwd(), 'libs/server/grpc/src/lib/proto/auth-ms.proto'),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthStrategy],
})
export class AuthModule {}

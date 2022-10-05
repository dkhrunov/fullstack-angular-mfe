import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule as AuthLibModule } from '@nx-mfe/server/auth';
import { UsersMs } from '@nx-mfe/server/grpc';
import { MailerModule } from '@nx-mfe/server/mailer';

import { Services } from '../constants';
import { TokenModule } from '../token/token.module';
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
          url: '0.0.0.0:3002',
          package: UsersMs.USERS_PACKAGE_NAME,
          // TODO монжо вынести в npm пакет,
          // но тогда придется публиковать пакет при каждом изменении,
          // пока что пусть будет такой путь для удобства разработки
          protoPath: 'libs/server/grpc/src/lib/proto/users-ms.proto',
        },
      },
    ]),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
    TokenModule,
    AuthLibModule,
  ],
  controllers: [AuthController],
  providers: [AUTH_SERVICE_PROVIDER],
})
export class AuthModule {}

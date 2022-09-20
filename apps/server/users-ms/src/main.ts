/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { RpcExceptionFilter, UsersMs } from '@nx-mfe/server/grpc';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3002;

  const microservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${PORT}`,
      package: UsersMs.protobufPackage,
      // TODO монжо вынести в npm пакет,
      // но тогда придется публиковать пакет при каждом изменении,
      // пока что пусть будет такой путь для удобства разработки
      protoPath: 'libs/server/grpc/src/lib/proto/users-ms.proto',
    },
  });

  microservice.useGlobalFilters(new RpcExceptionFilter());

  await microservice.listen();

  Logger.log(`🚀 User microservice is running on: 0.0.0.0:${PORT}`);
}

bootstrap();

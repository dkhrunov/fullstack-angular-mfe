/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthMs, GrpcExceptionFilter } from '@nx-mfe/server/grpc';
import { join } from 'path';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3001;

  const microservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      // BUG ip 0.0.0.0
      url: `0.0.0.0:${PORT}`,
      package: AuthMs.protobufPackage,
      // TODO монжо вынести в npm пакет,
      // но тогда придется публиковать пакет при каждом изменении,
      // пока что пусть будет такой путь для удобства разработки
      // protoPath: join(process.cwd(), 'libs/server/grpc/src/lib/proto/auth-ms.proto'),
      protoPath: join(__dirname, 'assets/proto/auth-ms.proto'),
    },
  });

  microservice.useGlobalFilters(new GrpcExceptionFilter());

  await microservice.listen();

  Logger.log(`🚀 Auth microservice is running on: 0.0.0.0:${PORT}`);
}

bootstrap();

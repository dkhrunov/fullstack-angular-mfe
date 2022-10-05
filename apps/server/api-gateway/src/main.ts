/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { GrpcToHttpExceptionFilter } from '@nx-mfe/server/grpc';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || 'api';

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GLOBAL_PREFIX);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GrpcToHttpExceptionFilter(httpAdapterHost));

  app.use(cookieParser());

  await app.listen(PORT);

  Logger.log(`🚀 Api Gateway is running on: http://localhost:${PORT}/${GLOBAL_PREFIX}`);
}

bootstrap();

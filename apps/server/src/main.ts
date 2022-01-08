/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';

async function bootstrap() {
	const PORT = process.env.PORT || 3000;
	const GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || 'api';

	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: true,
		credentials: true,
	});
	app.setGlobalPrefix(GLOBAL_PREFIX);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		})
	);
	app.use(cookieParser());

	await app.listen(PORT, () => {
		Logger.log('Listening at http://localhost:' + PORT + '/' + GLOBAL_PREFIX);
	});
}

bootstrap();

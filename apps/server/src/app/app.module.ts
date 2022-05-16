import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nx-mfe/server/mailer';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

@Module({
	controllers: [],
	providers: [],
	imports: [
		TypeOrmModule.forRoot({
			type: process.env.DB_TYPE as 'aurora-data-api',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT) || 5432,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			synchronize: !JSON.parse(process.env.PRODUCTION || 'false'),
			autoLoadEntities: true,
		}),
		// FIXME попробовать переместить в либу
		// и экспортировать из либы сконфигурированный модуль
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
		ScheduleModule.forRoot(),
		AuthModule,
		UserModule,
		TokenModule,
	],
})
export class AppModule {}

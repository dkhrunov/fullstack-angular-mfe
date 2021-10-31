import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PgDatabaseModule } from './db-connection/pg-database.module';
import { MailModule } from './mail/mail.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

@Module({
	controllers: [],
	providers: [],
	imports: [
		PgDatabaseModule,
		AuthModule,
		UserModule,
		TokenModule,
		MailModule,
	],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PgDatabaseModule } from './db-connection/pg-database.module';
import { UserModule } from './user/user.module';

@Module({
	controllers: [],
	providers: [],
	imports: [PgDatabaseModule, AuthModule, UserModule],
})
export class AppModule {}

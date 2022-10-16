import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';

@Module({
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
      migrations: ['./migrations/*{.ts,.js}'],
    }),
    UsersModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'aurora-mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: !(process.env.NODE_ENV?.trim() === 'production'),
      autoLoadEntities: true,
      migrations: ['./migrations/*{.ts,.js}'],
    }),
    UsersModule,
  ],
})
export class AppModule {}

import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    MailModule,
  ],
})
export class AppModule {}

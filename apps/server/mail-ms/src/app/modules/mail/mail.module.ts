// eslint-disable-next-line simple-import-sort/imports
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { resolve } from 'path';

import { MAIL_QUEUE, Services } from '../../constants';
import { MailController } from './mail.controller';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

const MAIL_SERVICE_PROVIDER = {
  provide: Services.MAIL_SERVICE,
  useClass: MailService,
};

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
      },
      // the header of the received emails is defined here. Customize this for your application.
      defaults: { from: '"NestJS Mailer" <test@test.com>' },
      template: {
        // here you must specify the path where the directory with all email templates is located
        dir: resolve(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  providers: [MAIL_SERVICE_PROVIDER, MailProcessor],
  controllers: [MailController],
})
export class MailModule {}

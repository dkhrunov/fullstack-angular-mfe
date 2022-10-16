// eslint-disable-next-line simple-import-sort/imports
import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';

import { CONFIRM_REGISTRATION, MAIL_QUEUE } from '../constants';
import { ConfirmRegistrationJob } from '../domains';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  private readonly _logger = new Logger(MailProcessor.name);

  constructor(private readonly _mailerService: MailerService) {}

  // TODO Job Interface
  @Process(CONFIRM_REGISTRATION)
  public async confirmRegistration(job: Job<ConfirmRegistrationJob>): Promise<void> {
    this._logger.log(`Sending confirm registration email to '${job.data.recipient}'`);

    try {
      // BUG получать домен через service discovery / или прокидывать через аргумент
      const link = `localhost:3000/api/auth/register/confirm/${job.data.token}`;

      await this._mailerService.sendMail({
        to: job.data.recipient,
        from: process.env.SMTP_USER,
        subject: 'Registration',
        // ! it must point to a template file name without the .hbs extension
        template: './registration',
        context: { link },
      });

      this._logger.log(`Sended confirm registration email to '${job.data.recipient}'`);
    } catch (error) {
      this._logger.error(`Failed to send confirmation email to '${job.data.recipient}'`);
    }
  }
}

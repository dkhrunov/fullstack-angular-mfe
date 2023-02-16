import { status } from '@grpc/grpc-js';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { GrpcException } from '@nx-mfe/server/grpc';
import { Queue } from 'bull';

import { IMailService } from '../../abstractions';
import { CONFIRM_REGISTRATION_JOB, MAIL_QUEUE } from '../../constants';
import { ConfirmRegistrationJobPayload } from '../../domains';

@Injectable()
export class MailService implements IMailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(@InjectQueue(MAIL_QUEUE) private readonly _mailQueue: Queue) {}

  public async confirmRegistration(recipient: string, token: string): Promise<void> {
    try {
      const confirmRegistrationJob = new ConfirmRegistrationJobPayload({
        recipient,
        token,
      });

      await this._mailQueue.add(CONFIRM_REGISTRATION_JOB, confirmRegistrationJob);
    } catch (error) {
      this._logger.error(`Error queueing registration email to user ${recipient}`);

      throw new GrpcException({
        code: status.INTERNAL,
        message: error ?? `Error queueing registration email to user ${recipient}`,
      });
    }
  }
}

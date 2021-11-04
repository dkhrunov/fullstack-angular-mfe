import { Inject, Injectable } from '@nestjs/common';
import { createTransport, SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer';

import { MAILER_OPTIONS_TOKEN } from './injection-tokens/mailer-options.token';
import { IMailerOptions } from './interfaces/mailer-options.interface';

@Injectable()
export class MailerService {
	private _transporter: Transporter;

	constructor(
		@Inject(MAILER_OPTIONS_TOKEN)
		private readonly _options: IMailerOptions
	) {
		if (!this._options.transport) {
			throw new Error(
				'Make sure to provide a nodemailer transport configuration object, connection url or a transport plugin instance.'
			);
		}

		this._transporter = createTransport(this._options.transport, this._options.defaults);
	}

	public async sendMail(options: SendMailOptions): Promise<SentMessageInfo> {
		if (this._transporter) {
			return await this._transporter.sendMail(options);
		} else {
			throw new ReferenceError(`Transporter object undefined`);
		}
	}
}

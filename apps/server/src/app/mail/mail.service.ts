import { Injectable } from '@nestjs/common';
import { MailerService } from '@nx-mfe/server/mailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
	constructor(private readonly _mailerService: MailerService) {}

	public async sendRegisterConfirmationMail(to: string, link: string): Promise<SentMessageInfo> {
		return await this._mailerService.sendMail({
			to,
			from: process.env.SMTP_USER,
			subject: 'Confirm account',
			text: '',
			html: `
					<div>
						<h1>To confirm registration, follow the link</h1>
						<a href="${link}">${link}</a>
					</div>
				`,
		});
	}
}

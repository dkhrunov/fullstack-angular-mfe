import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	public sendConfirmationMail(to: string, link: string) {
		console.log(to, link);
		return;
	}
}

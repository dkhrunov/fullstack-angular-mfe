import { DynamicModule, Global, Module } from '@nestjs/common';

import { IMailerOptions } from './interfaces/mailer-options.interface';
import { MailerService } from './mailer.service';
import { MAILER_OPTIONS_TOKEN } from './tokens/mailer-options.token';

@Global()
@Module({})
export class MailerCoreModule {
	public static forRoot(options: IMailerOptions): DynamicModule {
		return {
			module: MailerCoreModule,
			providers: [
				{
					provide: MAILER_OPTIONS_TOKEN,
					useValue: options,
				},
				MailerService,
			],
			exports: [MailerService],
		};
	}
}

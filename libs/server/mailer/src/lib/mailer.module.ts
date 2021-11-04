import { DynamicModule, Module } from '@nestjs/common';

import { IMailerOptions } from './interfaces/mailer-options.interface';
import { MailerCoreModule } from './mailer-core.module';

@Module({})
export class MailerModule {
	public static forRoot(options: IMailerOptions): DynamicModule {
		return {
			module: MailerModule,
			imports: [MailerCoreModule.forRoot(options)],
		};
	}
}

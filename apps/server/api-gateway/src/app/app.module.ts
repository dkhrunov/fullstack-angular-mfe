import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  // providers: [AuthStrategy],
  imports: [
    // PassportModule.register({
    //   defaultStrategy: 'jwt',
    //   property: 'user',
    //   session: false,
    // }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}

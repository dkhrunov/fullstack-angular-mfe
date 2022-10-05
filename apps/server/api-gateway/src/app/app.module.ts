import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

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

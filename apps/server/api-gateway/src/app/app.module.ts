import { Module } from '@nestjs/common';

// import { AuthModule as AuthLibModule } from '@nx-mfe/server/auth';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
})
export class AppModule {}

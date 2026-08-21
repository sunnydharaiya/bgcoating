import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ApiModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}

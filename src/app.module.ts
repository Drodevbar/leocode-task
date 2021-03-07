import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './module/api/api.module';

@Module({
  imports: [ApiModule, ConfigModule.forRoot()],
})
export class AppModule {}

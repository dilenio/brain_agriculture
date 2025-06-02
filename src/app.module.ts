import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmModule } from './modules/farm/farm.module';
import { DashboardModule } from './modules/farm/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:SlEjIxEGOibRIosXhMQRGtPUEFOtnoOV@postgres.railway.internal:5432/railway',
      autoLoadEntities: true,
      // synchronize: true, // Disable in production
    }),
    FarmModule,
    DashboardModule,
  ],
})
export class AppModule {}

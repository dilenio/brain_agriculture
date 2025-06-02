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
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      // synchronize: true, // Disable in production
    }),
    FarmModule,
    DashboardModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HarvestModule } from './modules/harvest/harvest.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: process.env.DATABASE_URL,
    //   autoLoadEntities: true,
    //   synchronize: true, // Disable in production
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'brain_agriculture',
      autoLoadEntities: true,
      synchronize: true,
    }),
    HarvestModule,
  ],
})
export class AppModule {}

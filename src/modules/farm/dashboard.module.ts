import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Farm } from '../farm/entities/farm.entity';
import { FarmCropHarvest } from './entities/farm-crop-harvest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, FarmCropHarvest])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

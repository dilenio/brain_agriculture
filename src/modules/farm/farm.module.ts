import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HarvestService } from './harvest.service';
import { HarvestController } from './harvest.controller';
import { CropController } from './crop.controller';
import { CropService } from './crop.service';
import { Harvest } from './entities/harvest.entity';
import { Crop } from './entities/crop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest, Crop])],
  controllers: [HarvestController, CropController],
  providers: [HarvestService, CropService],
})
export class FarmModule {}

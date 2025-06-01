import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HarvestService } from './harvest.service';
import { HarvestController } from './harvest.controller';
import { CropController } from './crop.controller';
import { CropService } from './crop.service';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { FarmCropHarvestController } from './farm-crop-harvest.controller';
import { FarmCropHarvestService } from './farm-crop-harvest.service';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { Harvest } from './entities/harvest.entity';
import { Crop } from './entities/crop.entity';
import { Farm } from './entities/farm.entity';
import { FarmCropHarvest } from './entities/farm-crop-harvest.entity';
import { Producer } from './entities/producer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Harvest, Crop, Farm, FarmCropHarvest, Producer]),
  ],
  controllers: [
    HarvestController,
    CropController,
    FarmController,
    FarmCropHarvestController,
    ProducerController,
  ],
  providers: [
    HarvestService,
    CropService,
    FarmService,
    FarmCropHarvestService,
    ProducerService,
  ],
})
export class FarmModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HarvestService } from './harvest.service';
import { HarvestController } from './harvest.controller';
import { Harvest } from './entities/harvest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest])],
  controllers: [HarvestController],
  providers: [HarvestService],
})
export class HarvestModule {}

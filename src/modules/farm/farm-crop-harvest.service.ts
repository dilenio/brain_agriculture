import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmCropHarvest } from './entities/farm-crop-harvest.entity';
import { CreateFarmCropHarvestDto } from './dtos/create-farm-crop-harvest.dto';
import { UpdateFarmCropHarvestDto } from './dtos/update-farm-crop-harvest.dto';
import { Farm } from './entities/farm.entity';
import { Harvest } from './entities/harvest.entity';
import { Crop } from './entities/crop.entity';

@Injectable()
export class FarmCropHarvestService {
  constructor(
    @InjectRepository(FarmCropHarvest)
    private farmCropHarvestRepository: Repository<FarmCropHarvest>,
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
    @InjectRepository(Harvest)
    private harvestRepository: Repository<Harvest>,
    @InjectRepository(Crop)
    private cropRepository: Repository<Crop>
  ) {}

  async create(
    createFarmCropHarvestDto: CreateFarmCropHarvestDto
  ): Promise<FarmCropHarvest> {
    const { farm_id, harvest_id, crop_id } = createFarmCropHarvestDto;

    const farm = await this.farmRepository.findOneBy({ id: farm_id });
    if (!farm) {
      throw new NotFoundException(`Farm with ID ${farm_id} not found`);
    }

    const harvest = await this.harvestRepository.findOneBy({ id: harvest_id });
    if (!harvest) {
      throw new NotFoundException(`Harvest with ID ${harvest_id} not found`);
    }

    const crop = await this.cropRepository.findOneBy({ id: crop_id });
    if (!crop) {
      throw new NotFoundException(`Crop with ID ${crop_id} not found`);
    }

    const farmCropHarvest = this.farmCropHarvestRepository.create({
      farm,
      harvest,
      crop,
    });

    return this.farmCropHarvestRepository.save(farmCropHarvest);
  }

  async findAll(): Promise<FarmCropHarvest[]> {
    return this.farmCropHarvestRepository.find({
      relations: ['farm', 'harvest', 'crop'],
    });
  }

  async findOne(id: string): Promise<FarmCropHarvest> {
    const farmCropHarvest = await this.farmCropHarvestRepository.findOne({
      where: { id },
      relations: ['farm', 'harvest', 'crop'],
    });
    if (!farmCropHarvest) {
      throw new NotFoundException(`FarmCropHarvest with ID ${id} not found`);
    }
    return farmCropHarvest;
  }

  async update(
    id: string,
    updateFarmCropHarvestDto: UpdateFarmCropHarvestDto
  ): Promise<FarmCropHarvest> {
    const farmCropHarvest = await this.findOne(id);

    if (updateFarmCropHarvestDto.farm_id) {
      const farm = await this.farmRepository.findOneBy({
        id: updateFarmCropHarvestDto.farm_id,
      });
      if (!farm) {
        throw new NotFoundException(
          `Farm with ID ${updateFarmCropHarvestDto.farm_id} not found`
        );
      }
      farmCropHarvest.farm = farm;
    }

    if (updateFarmCropHarvestDto.harvest_id) {
      const harvest = await this.harvestRepository.findOneBy({
        id: updateFarmCropHarvestDto.harvest_id,
      });
      if (!harvest) {
        throw new NotFoundException(
          `Harvest with ID ${updateFarmCropHarvestDto.harvest_id} not found`
        );
      }
      farmCropHarvest.harvest = harvest;
    }

    if (updateFarmCropHarvestDto.crop_id) {
      const crop = await this.cropRepository.findOneBy({
        id: updateFarmCropHarvestDto.crop_id,
      });
      if (!crop) {
        throw new NotFoundException(
          `Crop with ID ${updateFarmCropHarvestDto.crop_id} not found`
        );
      }
      farmCropHarvest.crop = crop;
    }

    return this.farmCropHarvestRepository.save(farmCropHarvest);
  }

  async delete(id: string): Promise<void> {
    const result = await this.farmCropHarvestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`FarmCropHarvest with ID ${id} not found`);
    }
  }
}

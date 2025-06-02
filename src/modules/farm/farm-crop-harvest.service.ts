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
    const { farm, harvest, crop } = createFarmCropHarvestDto;

    const farmFound = await this.farmRepository.findOneBy({ id: farm });
    if (!farmFound) {
      throw new NotFoundException(`Fazenda com o ID ${farm} não encontrada`);
    }

    const harvestFound = await this.harvestRepository.findOneBy({
      id: harvest,
    });
    if (!harvestFound) {
      throw new NotFoundException(`Safra com ID ${harvest} não encontrada`);
    }

    const cropFound = await this.cropRepository.findOneBy({ id: crop });
    if (!cropFound) {
      throw new NotFoundException(`Cultura com ID ${crop} não encontrada`);
    }

    const farmCropHarvest = this.farmCropHarvestRepository.create({
      farm: farmFound,
      harvest: harvestFound,
      crop: cropFound,
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
      throw new NotFoundException(
        `Fazenda Safra Cultura com ID ${id} não encontrado`
      );
    }
    return farmCropHarvest;
  }

  async update(
    id: string,
    updateFarmCropHarvestDto: UpdateFarmCropHarvestDto
  ): Promise<FarmCropHarvest> {
    const farmCropHarvest = await this.findOne(id);

    if (updateFarmCropHarvestDto.farm) {
      const farm = await this.farmRepository.findOneBy({
        id: updateFarmCropHarvestDto.farm,
      });
      if (!farm) {
        throw new NotFoundException(
          `Fazenda com ID ${updateFarmCropHarvestDto.farm} não encontrada`
        );
      }
      farmCropHarvest.farm = farm;
    }

    if (updateFarmCropHarvestDto.harvest) {
      const harvest = await this.harvestRepository.findOneBy({
        id: updateFarmCropHarvestDto.harvest,
      });
      if (!harvest) {
        throw new NotFoundException(
          `Safra com ID ${updateFarmCropHarvestDto.harvest} não encontrada`
        );
      }
      farmCropHarvest.harvest = harvest;
    }

    if (updateFarmCropHarvestDto.crop) {
      const crop = await this.cropRepository.findOneBy({
        id: updateFarmCropHarvestDto.crop,
      });
      if (!crop) {
        throw new NotFoundException(
          `Cultura com ID ${updateFarmCropHarvestDto.crop} não encontrada`
        );
      }
      farmCropHarvest.crop = crop;
    }

    return this.farmCropHarvestRepository.save(farmCropHarvest);
  }

  async delete(id: string): Promise<void> {
    const result = await this.farmCropHarvestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Fazenda Safra Cultura com ID ${id} não encontrada`
      );
    }
  }
}

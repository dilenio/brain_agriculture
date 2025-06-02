import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Harvest } from './entities/harvest.entity';
import { CreateHarvestDto } from './dtos/create-harvest.dto';
import { UpdateHarvestDto } from './dtos/update-harvest.dto';

@Injectable()
export class HarvestService {
  constructor(
    @InjectRepository(Harvest)
    private harvestRepository: Repository<Harvest>
  ) {}

  async create(createHarvestDto: CreateHarvestDto): Promise<Harvest> {
    const harvest = this.harvestRepository.create(createHarvestDto);
    return this.harvestRepository.save(harvest);
  }

  async findAll(): Promise<Harvest[]> {
    return this.harvestRepository.find();
  }

  async findOne(id: string): Promise<Harvest> {
    const harvest = await this.harvestRepository.findOneBy({ id });
    if (!harvest) {
      throw new NotFoundException(`Safra com ID ${id} não encontrado`);
    }
    return harvest;
  }

  async update(
    id: string,
    updateHarvestDto: UpdateHarvestDto
  ): Promise<Harvest> {
    const harvest = await this.findOne(id);
    Object.assign(harvest, updateHarvestDto);
    return this.harvestRepository.save(harvest);
  }

  async remove(id: string): Promise<void> {
    const result = await this.harvestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Safra com ID ${id} não encontrado`);
    }
  }
}

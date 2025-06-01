import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './entities/farm.entity';
import { CreateFarmDto } from './dtos/create-farm.dto';
import { UpdateFarmDto } from './dtos/update-farm.dto';
import { Producer } from './entities/producer.entity';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
    @InjectRepository(Producer)
    private producerRepository: Repository<Producer>
  ) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    const { farm_name, producer_id } = createFarmDto;
    const producer = await this.producerRepository.findOneBy({
      id: producer_id,
    });
    if (!producer) {
      throw new NotFoundException(`Producer with ID ${producer_id} not found`);
    }
    const farm = this.farmRepository.create({ farm_name, producer });
    return this.farmRepository.save(farm);
  }

  async findAll(): Promise<Farm[]> {
    return this.farmRepository.find({
      relations: ['producer', 'crops_harvests'],
    });
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ['producer', 'crops_harvests'],
    });
    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    return farm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.findOne(id);
    if (updateFarmDto.producer_id) {
      const producer = await this.producerRepository.findOneBy({
        id: updateFarmDto.producer_id,
      });
      if (!producer) {
        throw new NotFoundException(
          `Producer with ID ${updateFarmDto.producer_id} not found`
        );
      }
      farm.producer = producer;
    }
    if (updateFarmDto.farm_name) {
      farm.farm_name = updateFarmDto.farm_name;
    }
    return this.farmRepository.save(farm);
  }

  async delete(id: string): Promise<void> {
    const result = await this.farmRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
  }
}

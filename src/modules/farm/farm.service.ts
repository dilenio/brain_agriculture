import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    const {
      farm_name,
      city,
      state,
      total_farm_area,
      arable_area,
      vegetation_area,
      producerId,
    } = createFarmDto;

    const producer = await this.producerRepository.findOneBy({
      id: producerId,
    });
    if (!producer) {
      throw new NotFoundException(`Producer with ID ${producerId} not found`);
    }

    const farm = this.farmRepository.create({
      farm_name,
      city,
      state,
      total_farm_area,
      arable_area,
      vegetation_area,
      producer,
    });

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

    if (
      updateFarmDto.total_farm_area !== undefined ||
      updateFarmDto.arable_area !== undefined ||
      updateFarmDto.vegetation_area !== undefined
    ) {
      const newTotalFarmArea =
        updateFarmDto.total_farm_area ?? farm.total_farm_area;
      const newArableArea = updateFarmDto.arable_area ?? farm.arable_area;
      const newVegetationArea =
        updateFarmDto.vegetation_area ?? farm.vegetation_area;

      if (newArableArea > newTotalFarmArea) {
        throw new BadRequestException(
          'arable_area must not exceed total_farm_area.'
        );
      }
      if (newVegetationArea > newTotalFarmArea) {
        throw new BadRequestException(
          'vegetation_area must not exceed total_farm_area.'
        );
      }
      if (newArableArea + newVegetationArea > newTotalFarmArea) {
        throw new BadRequestException(
          'The sum of arable_area and vegetation_area must not exceed total_farm_area.'
        );
      }
    }

    if (updateFarmDto.producerId) {
      const producer = await this.producerRepository.findOneBy({
        id: updateFarmDto.producerId,
      });
      if (!producer) {
        throw new NotFoundException(
          `Producer with ID ${updateFarmDto.producerId} not found`
        );
      }
      farm.producer = producer;
    }

    if (updateFarmDto.farm_name) {
      farm.farm_name = updateFarmDto.farm_name;
    }
    if (updateFarmDto.city) {
      farm.city = updateFarmDto.city;
    }
    if (updateFarmDto.state) {
      farm.state = updateFarmDto.state;
    }
    if (updateFarmDto.total_farm_area !== undefined) {
      farm.total_farm_area = updateFarmDto.total_farm_area;
    }
    if (updateFarmDto.arable_area !== undefined) {
      farm.arable_area = updateFarmDto.arable_area;
    }
    if (updateFarmDto.vegetation_area !== undefined) {
      farm.vegetation_area = updateFarmDto.vegetation_area;
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

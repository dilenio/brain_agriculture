import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dtos/create-crop.dto';
import { UpdateCropDto } from './dtos/update-crop.dto';

@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Crop)
    private cropRepository: Repository<Crop>
  ) {}

  async create(createCropDto: CreateCropDto): Promise<Crop> {
    const crop = this.cropRepository.create(createCropDto);
    return this.cropRepository.save(crop);
  }

  async findAll(): Promise<Crop[]> {
    return this.cropRepository.find();
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropRepository.findOneBy({ id });
    if (!crop) {
      throw new NotFoundException(`Cultura com o ID ${id} não encontrada`);
    }
    return crop;
  }

  async update(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findOne(id);
    Object.assign(crop, updateCropDto);
    return this.cropRepository.save(crop);
  }

  async remove(id: string): Promise<void> {
    const result = await this.cropRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cultura com o ID ${id} não encontrada`);
    }
  }
}

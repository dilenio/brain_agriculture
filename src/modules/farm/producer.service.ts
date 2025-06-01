import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dtos/create-producer.dto';
import { UpdateProducerDto } from './dtos/update-producer.dto';

@Injectable()
export class ProducerService {
  constructor(
    @InjectRepository(Producer)
    private producerRepository: Repository<Producer>
  ) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    const producer = this.producerRepository.create(createProducerDto);
    return this.producerRepository.save(producer);
  }

  async findAll(): Promise<Producer[]> {
    return this.producerRepository.find({ relations: ['farms'] });
  }

  async findOne(id: string): Promise<Producer> {
    const producer = await this.producerRepository.findOne({
      where: { id },
      relations: ['farms'],
    });
    if (!producer) {
      throw new NotFoundException(`Producer with ID ${id} not found`);
    }
    return producer;
  }

  async update(
    id: string,
    updateProducerDto: UpdateProducerDto
  ): Promise<Producer> {
    const producer = await this.findOne(id);
    Object.assign(producer, updateProducerDto);
    return this.producerRepository.save(producer);
  }

  async delete(id: string): Promise<void> {
    const result = await this.producerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producer with ID ${id} not found`);
    }
  }
}

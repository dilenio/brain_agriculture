import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  private cleanCpfCnpj(cpfCnpj: string): string {
    return cpfCnpj.replace(/[^\d]/g, '');
  }

  private async checkCpfCnpjUniqueness(
    cpfCnpj: string,
    excludeId?: string
  ): Promise<void> {
    const cleanCpfCnpj = this.cleanCpfCnpj(cpfCnpj);

    const queryBuilder = this.producerRepository
      .createQueryBuilder('producer')
      .where(
        "REGEXP_REPLACE(producer.cpf_cnpj, '[^0-9]', '') = :cleanCpfCnpj",
        { cleanCpfCnpj }
      );

    if (excludeId) {
      queryBuilder.andWhere('producer.id != :excludeId', { excludeId });
    }

    const existingProducer = await queryBuilder.getOne();
    if (existingProducer) {
      throw new BadRequestException('CPF or CNPJ already exists.');
    }
  }

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    const { producer_name, cpf_cnpj } = createProducerDto;

    await this.checkCpfCnpjUniqueness(cpf_cnpj);

    const producer = this.producerRepository.create({
      producer_name,
      cpf_cnpj: this.cleanCpfCnpj(cpf_cnpj),
    });

    return this.producerRepository.save(producer);
  }

  async findAll(): Promise<Producer[]> {
    return this.producerRepository.find({ relations: ['farms'] });
  }

  async findOne(id: string): Promise<Producer> {
    const producer = await this.producerRepository.findOne({
      where: { id },
      relations: [
        'farms',
        'farms.crops_harvests',
        'farms.crops_harvests.harvest',
        'farms.crops_harvests.crop',
      ],
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

    if (updateProducerDto.cpf_cnpj) {
      await this.checkCpfCnpjUniqueness(updateProducerDto.cpf_cnpj, id);
      producer.cpf_cnpj = this.cleanCpfCnpj(updateProducerDto.cpf_cnpj);
    }

    if (updateProducerDto.producer_name) {
      producer.producer_name = updateProducerDto.producer_name;
    }

    return this.producerRepository.save(producer);
  }

  async delete(id: string): Promise<void> {
    const result = await this.producerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producer with ID ${id} not found`);
    }
  }
}

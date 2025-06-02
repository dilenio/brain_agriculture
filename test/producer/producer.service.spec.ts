import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProducerService } from '../../src/modules/farm/producer.service';
import { Producer } from '../../src/modules/farm/entities/producer.entity';
import { CreateProducerDto } from '../../src/modules/farm/dtos/create-producer.dto';
import { UpdateProducerDto } from '../../src/modules/farm/dtos/update-producer.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProducerService', () => {
  let service: ProducerService;

  const mockProducer = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    producer_name: 'João Silva',
    cpf_cnpj: '12345678909',
    farms: [],
  };

  const mockProducerRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: getRepositoryToken(Producer),
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a producer', async () => {
      const createProducerDto: CreateProducerDto = {
        producer_name: 'João Silva',
        cpf_cnpj: '123.456.789-09',
      };
      const cleanedProducer = { ...mockProducer, cpf_cnpj: '12345678909' };

      mockProducerRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });
      mockProducerRepository.create.mockReturnValue(cleanedProducer);
      mockProducerRepository.save.mockResolvedValue(cleanedProducer);

      const result = await service.create(createProducerDto);

      expect(mockProducerRepository.createQueryBuilder).toHaveBeenCalledWith(
        'producer'
      );
      expect(mockProducerRepository.create).toHaveBeenCalledWith({
        producer_name: createProducerDto.producer_name,
        cpf_cnpj: '12345678909',
      });
      expect(mockProducerRepository.save).toHaveBeenCalledWith(cleanedProducer);
      expect(result).toEqual(cleanedProducer);
    });

    it('should throw BadRequestException if CPF/CNPJ already exists', async () => {
      const createProducerDto: CreateProducerDto = {
        producer_name: 'João Silva',
        cpf_cnpj: '123.456.789-09',
      };

      mockProducerRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockProducer),
      });

      await expect(service.create(createProducerDto)).rejects.toThrow(
        new BadRequestException('CPF ou CNPJ já cadastrado')
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of producers with farms', async () => {
      const producers = [
        mockProducer,
        { ...mockProducer, id: 'another-uuid', producer_name: 'Maria Santos' },
      ];
      mockProducerRepository.find.mockResolvedValue(producers);

      const result = await service.findAll();

      expect(mockProducerRepository.find).toHaveBeenCalledWith({
        relations: ['farms'],
      });
      expect(result).toEqual(producers);
    });

    it('should return an empty array if no producers exist', async () => {
      mockProducerRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockProducerRepository.find).toHaveBeenCalledWith({
        relations: ['farms'],
      });
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a producer by ID with relations', async () => {
      mockProducerRepository.findOne.mockResolvedValue(mockProducer);

      const result = await service.findOne(mockProducer.id);

      expect(mockProducerRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProducer.id },
        relations: [
          'farms',
          'farms.crops_harvests',
          'farms.crops_harvests.harvest',
          'farms.crops_harvests.crop',
        ],
      });
      expect(result).toEqual(mockProducer);
    });

    it('should throw NotFoundException if producer is not found', async () => {
      mockProducerRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('id-invalido')).rejects.toThrow(
        new NotFoundException(`Produtor com o ID id-invalido não encontrado`)
      );
      expect(mockProducerRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'id-invalido' },
        relations: [
          'farms',
          'farms.crops_harvests',
          'farms.crops_harvests.harvest',
          'farms.crops_harvests.crop',
        ],
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated producer', async () => {
      const updateProducerDto: UpdateProducerDto = {
        producer_name: 'João Atualizado',
        cpf_cnpj: '98.765.432/0001-10',
      };
      const updatedProducer = {
        ...mockProducer,
        producer_name: 'João Atualizado',
        cpf_cnpj: '98765432000110',
      };

      mockProducerRepository.findOne.mockResolvedValue(mockProducer);
      mockProducerRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });
      mockProducerRepository.save.mockResolvedValue(updatedProducer);

      const result = await service.update(mockProducer.id, updateProducerDto);

      expect(mockProducerRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProducer.id },
        relations: [
          'farms',
          'farms.crops_harvests',
          'farms.crops_harvests.harvest',
          'farms.crops_harvests.crop',
        ],
      });
      expect(mockProducerRepository.createQueryBuilder).toHaveBeenCalledWith(
        'producer'
      );
      expect(mockProducerRepository.save).toHaveBeenCalledWith(updatedProducer);
      expect(result).toEqual(updatedProducer);
    });

    it('should throw NotFoundException if producer to update is not found', async () => {
      mockProducerRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('id-invalido', { producer_name: 'João Atualizado' })
      ).rejects.toThrow(
        new NotFoundException(`Produtor com o ID id-invalido não encontrado`)
      );
      expect(mockProducerRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'id-invalido' },
        relations: [
          'farms',
          'farms.crops_harvests',
          'farms.crops_harvests.harvest',
          'farms.crops_harvests.crop',
        ],
      });
    });

    it('should throw BadRequestException if updated CPF/CNPJ already exists', async () => {
      const updateProducerDto: UpdateProducerDto = {
        cpf_cnpj: '98.765.432/0001-10',
      };

      mockProducerRepository.findOne.mockResolvedValue(mockProducer);
      mockProducerRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: 'outro-uuid',
          producer_name: 'Maria',
          cpf_cnpj: '98765432000110',
        }),
      });

      await expect(
        service.update(mockProducer.id, updateProducerDto)
      ).rejects.toThrow(new BadRequestException('CPF ou CNPJ já cadastrado'));
    });

    it('should update only producer_name if provided', async () => {
      const updateProducerDto: UpdateProducerDto = {
        producer_name: 'João Atualizado',
      };
      const updatedProducer = {
        ...mockProducer,
        producer_name: 'João Atualizado',
      };

      mockProducerRepository.findOne.mockResolvedValue(mockProducer);
      mockProducerRepository.save.mockResolvedValue(updatedProducer);

      const result = await service.update(mockProducer.id, updateProducerDto);

      expect(mockProducerRepository.findOne).toHaveBeenCalled();
      expect(mockProducerRepository.save).toHaveBeenCalledWith(updatedProducer);
      expect(result).toEqual(updatedProducer);
    });
  });

  describe('delete', () => {
    it('should delete a producer successfully', async () => {
      mockProducerRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(mockProducer.id);

      expect(mockProducerRepository.delete).toHaveBeenCalledWith(
        mockProducer.id
      );
    });

    it('should throw NotFoundException if producer to delete is not found', async () => {
      mockProducerRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete('id-invalido')).rejects.toThrow(
        new NotFoundException(`Produtor com o ID id-invalido não encontrado`)
      );
      expect(mockProducerRepository.delete).toHaveBeenCalledWith('id-invalido');
    });
  });

  describe('cleanCpfCnpj', () => {
    it('should clean CPF/CNPJ by removing non-digits', async () => {
      const createProducerDto: CreateProducerDto = {
        producer_name: 'João Silva',
        cpf_cnpj: '123.456.789-09',
      };

      mockProducerRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });
      mockProducerRepository.create.mockReturnValue(mockProducer);
      mockProducerRepository.save.mockResolvedValue(mockProducer);

      await service.create(createProducerDto);

      expect(mockProducerRepository.create).toHaveBeenCalledWith({
        producer_name: createProducerDto.producer_name,
        cpf_cnpj: '12345678909',
      });
    });

    it('should clean CNPJ with different format', async () => {
      const createProducerDto: CreateProducerDto = {
        producer_name: 'João Silva',
        cpf_cnpj: '12.345.678/0001-95',
      };

      mockProducerRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });
      mockProducerRepository.create.mockReturnValue({
        ...mockProducer,
        cpf_cnpj: '12345678000195',
      });
      mockProducerRepository.save.mockResolvedValue({
        ...mockProducer,
        cpf_cnpj: '12345678000195',
      });

      await service.create(createProducerDto);

      expect(mockProducerRepository.create).toHaveBeenCalledWith({
        producer_name: createProducerDto.producer_name,
        cpf_cnpj: '12345678000195',
      });
    });
  });
});

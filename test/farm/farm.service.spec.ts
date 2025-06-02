import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FarmService } from '../../src/modules/farm/farm.service';
import { Farm } from '../../src/modules/farm/entities/farm.entity';
import { Producer } from '../../src/modules/farm/entities/producer.entity';
import { CreateFarmDto } from '../../src/modules/farm/dtos/create-farm.dto';
import { UpdateFarmDto } from '../../src/modules/farm/dtos/update-farm.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('FarmService', () => {
  let service: FarmService;

  const mockProducer = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    producer_name: 'João Silva',
    cpf_cnpj: '12345678909',
    farms: [],
  };

  const mockFarm = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    farm_name: 'Fazenda Boa Vista',
    city: 'Uberlândia',
    state: 'MG',
    total_farm_area: 100,
    arable_area: 80,
    vegetation_area: 20,
    producer: mockProducer,
    crops_harvests: [],
  };

  const mockFarmRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockProducerRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: getRepositoryToken(Farm),
          useValue: mockFarmRepository,
        },
        {
          provide: getRepositoryToken(Producer),
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<FarmService>(FarmService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a farm', async () => {
      const createFarmDto: CreateFarmDto = {
        farm_name: 'Fazenda Boa Vista',
        city: 'Uberlândia',
        state: 'MG',
        total_farm_area: 100,
        arable_area: 80,
        vegetation_area: 20,
        producerId: mockProducer.id,
      };

      mockProducerRepository.findOneBy.mockResolvedValue(mockProducer);
      mockFarmRepository.create.mockReturnValue(mockFarm);
      mockFarmRepository.save.mockResolvedValue(mockFarm);

      const result = await service.create(createFarmDto);

      expect(mockProducerRepository.findOneBy).toHaveBeenCalledWith({
        id: mockProducer.id,
      });
      expect(mockFarmRepository.create).toHaveBeenCalledWith({
        farm_name: createFarmDto.farm_name,
        city: createFarmDto.city,
        state: createFarmDto.state,
        total_farm_area: createFarmDto.total_farm_area,
        arable_area: createFarmDto.arable_area,
        vegetation_area: createFarmDto.vegetation_area,
        producer: mockProducer,
      });
      expect(mockFarmRepository.save).toHaveBeenCalledWith(mockFarm);
      expect(result).toEqual(mockFarm);
    });

    it('should throw NotFoundException if producer is not found', async () => {
      const createFarmDto: CreateFarmDto = {
        farm_name: 'Fazenda Boa Vista',
        city: 'Uberlândia',
        state: 'MG',
        total_farm_area: 100,
        arable_area: 80,
        vegetation_area: 20,
        producerId: 'invalid-id',
      };

      mockProducerRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createFarmDto)).rejects.toThrow(
        new NotFoundException(`Produtor com o ID invalid-id não encontrado`)
      );
      expect(mockProducerRepository.findOneBy).toHaveBeenCalledWith({
        id: 'invalid-id',
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of farms with relations', async () => {
      const farms = [
        mockFarm,
        { ...mockFarm, id: 'another-uuid', farm_name: 'Fazenda Nova' },
      ];
      mockFarmRepository.find.mockResolvedValue(farms);

      const result = await service.findAll();

      expect(mockFarmRepository.find).toHaveBeenCalledWith({
        relations: ['producer', 'crops_harvests'],
      });
      expect(result).toEqual(farms);
    });

    it('should return an empty array if no farms exist', async () => {
      mockFarmRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockFarmRepository.find).toHaveBeenCalledWith({
        relations: ['producer', 'crops_harvests'],
      });
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a farm by ID with relations', async () => {
      mockFarmRepository.findOne.mockResolvedValue(mockFarm);

      const result = await service.findOne(mockFarm.id);

      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockFarm.id },
        relations: ['producer', 'crops_harvests'],
      });
      expect(result).toEqual(mockFarm);
    });

    it('should throw NotFoundException if farm is not found', async () => {
      mockFarmRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new NotFoundException(`Fazenda com o ID invalid-id não encontrada`)
      );
      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
        relations: ['producer', 'crops_harvests'],
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated farm', async () => {
      const updateFarmDto: UpdateFarmDto = {
        farm_name: 'Fazenda Atualizada',
        city: 'Patos de Minas',
        state: 'MG',
        total_farm_area: 120,
        arable_area: 90,
        vegetation_area: 30,
        producerId: mockProducer.id,
      };
      const updatedFarm = {
        ...mockFarm,
        farm_name: updateFarmDto.farm_name,
        city: updateFarmDto.city,
        state: updateFarmDto.state,
        total_farm_area: updateFarmDto.total_farm_area,
        arable_area: updateFarmDto.arable_area,
        vegetation_area: updateFarmDto.vegetation_area,
        producer: mockProducer,
      };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      mockProducerRepository.findOneBy.mockResolvedValue(mockProducer);
      mockFarmRepository.save.mockResolvedValue(updatedFarm);

      const result = await service.update(mockFarm.id, updateFarmDto);

      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockFarm.id },
        relations: ['producer', 'crops_harvests'],
      });
      expect(mockProducerRepository.findOneBy).toHaveBeenCalledWith({
        id: mockProducer.id,
      });
      expect(mockFarmRepository.save).toHaveBeenCalledWith(updatedFarm);
      expect(result).toEqual(updatedFarm);
    });

    it('should update only farm_name if provided', async () => {
      const updateFarmDto: UpdateFarmDto = { farm_name: 'Fazenda Atualizada' };
      const updatedFarm = { ...mockFarm, farm_name: 'Fazenda Atualizada' };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      mockFarmRepository.save.mockResolvedValue(updatedFarm);

      const result = await service.update(mockFarm.id, updateFarmDto);

      expect(mockFarmRepository.findOne).toHaveBeenCalled();
      expect(mockFarmRepository.save).toHaveBeenCalledWith(updatedFarm);
      expect(result).toEqual(updatedFarm);
    });

    it('should throw NotFoundException if farm to update is not found', async () => {
      mockFarmRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', { farm_name: 'Fazenda Atualizada' })
      ).rejects.toThrow(
        new NotFoundException(`Fazenda com o ID invalid-id não encontrada`)
      );
      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
        relations: ['producer', 'crops_harvests'],
      });
    });

    it('should throw NotFoundException if new producer is not found', async () => {
      const updateFarmDto: UpdateFarmDto = { producerId: 'invalid-id' };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      mockProducerRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(mockFarm.id, updateFarmDto)).rejects.toThrow(
        new NotFoundException(`Produtor com o ID invalid-id não encontrado`)
      );
      expect(mockProducerRepository.findOneBy).toHaveBeenCalledWith({
        id: 'invalid-id',
      });
    });

    it('should throw BadRequestException if arable_area exceeds total_farm_area', async () => {
      const updateFarmDto: UpdateFarmDto = { arable_area: 150 };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);

      await expect(service.update(mockFarm.id, updateFarmDto)).rejects.toThrow(
        new BadRequestException(
          'arable_area não deve exceder a total_farm_area.'
        )
      );
    });

    it('should throw BadRequestException if vegetation_area exceeds total_farm_area', async () => {
      const updateFarmDto: UpdateFarmDto = { vegetation_area: 150 };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);

      await expect(service.update(mockFarm.id, updateFarmDto)).rejects.toThrow(
        new BadRequestException(
          'vegetation_area não deve exceder a total_farm_area.'
        )
      );
    });

    it('should throw BadRequestException if arable_area + vegetation_area exceeds total_farm_area', async () => {
      const updateFarmDto: UpdateFarmDto = {
        arable_area: 80,
        vegetation_area: 50,
      };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);

      await expect(service.update(mockFarm.id, updateFarmDto)).rejects.toThrow(
        new BadRequestException(
          'A soma de arable_area e vegetation_area não deve exceder a total_farm_area.'
        )
      );
    });
  });

  describe('delete', () => {
    it('should delete a farm successfully', async () => {
      mockFarmRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(mockFarm.id);

      expect(mockFarmRepository.delete).toHaveBeenCalledWith(mockFarm.id);
    });

    it('should throw NotFoundException if farm to delete is not found', async () => {
      mockFarmRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete('invalid-id')).rejects.toThrow(
        new NotFoundException(`Fazenda com o ID invalid-id não encontrada`)
      );
      expect(mockFarmRepository.delete).toHaveBeenCalledWith('invalid-id');
    });
  });
});

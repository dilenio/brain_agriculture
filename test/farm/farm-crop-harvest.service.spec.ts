import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FarmCropHarvestService } from '../../src/modules/farm/farm-crop-harvest.service';
import { FarmCropHarvest } from '../../src/modules/farm/entities/farm-crop-harvest.entity';
import { Farm } from '../../src/modules/farm/entities/farm.entity';
import { Harvest } from '../../src/modules/farm/entities/harvest.entity';
import { Crop } from '../../src/modules/farm/entities/crop.entity';
import { CreateFarmCropHarvestDto } from '../../src/modules/farm/dtos/create-farm-crop-harvest.dto';
import { UpdateFarmCropHarvestDto } from '../../src/modules/farm/dtos/update-farm-crop-harvest.dto';
import { NotFoundException } from '@nestjs/common';

describe('FarmCropHarvestService', () => {
  let service: FarmCropHarvestService;

  const mockFarm = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    farm_name: 'Fazenda Boa Vista',
    city: 'Uberlândia',
    state: 'MG',
    total_farm_area: 100,
    arable_area: 80,
    vegetation_area: 20,
    crops_harvests: [],
  };

  const mockHarvest = {
    id: '789e1234-e89b-12d3-a456-426614174001',
    name: 'Safra 2023',
  };

  const mockCrop = {
    id: '456e7890-e89b-12d3-a456-426614174002',
    name: 'Soja',
  };

  const mockFarmCropHarvest = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    farm: mockFarm,
    harvest: mockHarvest,
    crop: mockCrop,
  };

  const mockFarmCropHarvestRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockFarmRepository = {
    findOneBy: jest.fn(),
  };

  const mockHarvestRepository = {
    findOneBy: jest.fn(),
  };

  const mockCropRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmCropHarvestService,
        {
          provide: getRepositoryToken(FarmCropHarvest),
          useValue: mockFarmCropHarvestRepository,
        },
        {
          provide: getRepositoryToken(Farm),
          useValue: mockFarmRepository,
        },
        {
          provide: getRepositoryToken(Harvest),
          useValue: mockHarvestRepository,
        },
        {
          provide: getRepositoryToken(Crop),
          useValue: mockCropRepository,
        },
      ],
    }).compile();

    service = module.get<FarmCropHarvestService>(FarmCropHarvestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a farm-crop-harvest association', async () => {
      const createFarmCropHarvestDto: CreateFarmCropHarvestDto = {
        farm: mockFarm.id,
        harvest: mockHarvest.id,
        crop: mockCrop.id,
      };

      mockFarmRepository.findOneBy.mockResolvedValue(mockFarm);
      mockHarvestRepository.findOneBy.mockResolvedValue(mockHarvest);
      mockCropRepository.findOneBy.mockResolvedValue(mockCrop);
      mockFarmCropHarvestRepository.create.mockReturnValue(mockFarmCropHarvest);
      mockFarmCropHarvestRepository.save.mockResolvedValue(mockFarmCropHarvest);

      const result = await service.create(createFarmCropHarvestDto);

      expect(mockFarmRepository.findOneBy).toHaveBeenCalledWith({
        id: mockFarm.id,
      });
      expect(mockHarvestRepository.findOneBy).toHaveBeenCalledWith({
        id: mockHarvest.id,
      });
      expect(mockCropRepository.findOneBy).toHaveBeenCalledWith({
        id: mockCrop.id,
      });
      expect(mockFarmCropHarvestRepository.create).toHaveBeenCalledWith({
        farm: mockFarm,
        harvest: mockHarvest,
        crop: mockCrop,
      });
      expect(mockFarmCropHarvestRepository.save).toHaveBeenCalledWith(
        mockFarmCropHarvest
      );
      expect(result).toEqual(mockFarmCropHarvest);
    });

    it('should throw NotFoundException if farm is not found', async () => {
      const createFarmCropHarvestDto: CreateFarmCropHarvestDto = {
        farm: 'id-invalido',
        harvest: mockHarvest.id,
        crop: mockCrop.id,
      };

      mockFarmRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createFarmCropHarvestDto)).rejects.toThrow(
        new NotFoundException(`Fazenda com o ID id-invalido não encontrada`)
      );
      expect(mockFarmRepository.findOneBy).toHaveBeenCalledWith({
        id: 'id-invalido',
      });
    });

    it('should throw NotFoundException if harvest is not found', async () => {
      const createFarmCropHarvestDto: CreateFarmCropHarvestDto = {
        farm: mockFarm.id,
        harvest: 'id-invalido',
        crop: mockCrop.id,
      };

      mockFarmRepository.findOneBy.mockResolvedValue(mockFarm);
      mockHarvestRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createFarmCropHarvestDto)).rejects.toThrow(
        new NotFoundException(`Safra com ID id-invalido não encontrada`)
      );
      expect(mockHarvestRepository.findOneBy).toHaveBeenCalledWith({
        id: 'id-invalido',
      });
    });

    it('should throw NotFoundException if crop is not found', async () => {
      const createFarmCropHarvestDto: CreateFarmCropHarvestDto = {
        farm: mockFarm.id,
        harvest: mockHarvest.id,
        crop: 'id-invalido',
      };

      mockFarmRepository.findOneBy.mockResolvedValue(mockFarm);
      mockHarvestRepository.findOneBy.mockResolvedValue(mockHarvest);
      mockCropRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createFarmCropHarvestDto)).rejects.toThrow(
        new NotFoundException(`Cultura com ID id-invalido não encontrada`)
      );
      expect(mockCropRepository.findOneBy).toHaveBeenCalledWith({
        id: 'id-invalido',
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of farm-crop-harvest associations', async () => {
      const associations = [
        mockFarmCropHarvest,
        { ...mockFarmCropHarvest, id: 'another-uuid' },
      ];
      mockFarmCropHarvestRepository.find.mockResolvedValue(associations);

      const result = await service.findAll();

      expect(mockFarmCropHarvestRepository.find).toHaveBeenCalledWith({
        relations: ['farm', 'harvest', 'crop'],
      });
      expect(result).toEqual(associations);
    });

    it('should return an empty array if no associations exist', async () => {
      mockFarmCropHarvestRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockFarmCropHarvestRepository.find).toHaveBeenCalledWith({
        relations: ['farm', 'harvest', 'crop'],
      });
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a farm-crop-harvest association by ID', async () => {
      mockFarmCropHarvestRepository.findOne.mockResolvedValue(
        mockFarmCropHarvest
      );

      const result = await service.findOne(mockFarmCropHarvest.id);

      expect(mockFarmCropHarvestRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockFarmCropHarvest.id },
        relations: ['farm', 'harvest', 'crop'],
      });
      expect(result).toEqual(mockFarmCropHarvest);
    });

    it('should throw NotFoundException if association is not found', async () => {
      mockFarmCropHarvestRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('id-invalido')).rejects.toThrow(
        new NotFoundException(
          `Fazenda Safra Cultura com ID id-invalido não encontrado`
        )
      );
      expect(mockFarmCropHarvestRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'id-invalido' },
        relations: ['farm', 'harvest', 'crop'],
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated association', async () => {
      const updateFarmCropHarvestDto: UpdateFarmCropHarvestDto = {
        farm: 'new-farm-id',
        harvest: 'new-harvest-id',
        crop: 'new-crop-id',
      };
      const newFarm = { ...mockFarm, id: 'new-farm-id' };
      const newHarvest = { ...mockHarvest, id: 'new-harvest-id' };
      const newCrop = { ...mockCrop, id: 'new-crop-id' };
      const updatedAssociation = {
        ...mockFarmCropHarvest,
        farm: newFarm,
        harvest: newHarvest,
        crop: newCrop,
      };

      mockFarmCropHarvestRepository.findOne.mockResolvedValue(
        mockFarmCropHarvest
      );
      mockFarmRepository.findOneBy.mockResolvedValue(newFarm);
      mockHarvestRepository.findOneBy.mockResolvedValue(newHarvest);
      mockCropRepository.findOneBy.mockResolvedValue(newCrop);
      mockFarmCropHarvestRepository.save.mockResolvedValue(updatedAssociation);

      const result = await service.update(
        mockFarmCropHarvest.id,
        updateFarmCropHarvestDto
      );

      expect(mockFarmCropHarvestRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockFarmCropHarvest.id },
        relations: ['farm', 'harvest', 'crop'],
      });
      expect(mockFarmRepository.findOneBy).toHaveBeenCalledWith({
        id: 'new-farm-id',
      });
      expect(mockHarvestRepository.findOneBy).toHaveBeenCalledWith({
        id: 'new-harvest-id',
      });
      expect(mockCropRepository.findOneBy).toHaveBeenCalledWith({
        id: 'new-crop-id',
      });
      expect(mockFarmCropHarvestRepository.save).toHaveBeenCalledWith(
        updatedAssociation
      );
      expect(result).toEqual(updatedAssociation);
    });

    it('should update only farm if provided', async () => {
      const updateFarmCropHarvestDto: UpdateFarmCropHarvestDto = {
        farm: 'new-farm-id',
      };
      const newFarm = { ...mockFarm, id: 'new-farm-id' };
      const updatedAssociation = { ...mockFarmCropHarvest, farm: newFarm };

      mockFarmCropHarvestRepository.findOne.mockResolvedValue(
        mockFarmCropHarvest
      );
      mockFarmRepository.findOneBy.mockResolvedValue(newFarm);
      mockFarmCropHarvestRepository.save.mockResolvedValue(updatedAssociation);

      const result = await service.update(
        mockFarmCropHarvest.id,
        updateFarmCropHarvestDto
      );

      expect(mockFarmRepository.findOneBy).toHaveBeenCalledWith({
        id: 'new-farm-id',
      });
      expect(mockHarvestRepository.findOneBy).not.toHaveBeenCalled();
      expect(mockCropRepository.findOneBy).not.toHaveBeenCalled();
      expect(mockFarmCropHarvestRepository.save).toHaveBeenCalledWith(
        updatedAssociation
      );
      expect(result).toEqual(updatedAssociation);
    });

    it('should throw NotFoundException if association to update is not found', async () => {
      mockFarmCropHarvestRepository.findOne.mockResolvedValue(null);

      await expect(service.update('id-invalido', {})).rejects.toThrow(
        new NotFoundException(
          `Fazenda Safra Cultura com ID id-invalido não encontrado`
        )
      );
      expect(mockFarmCropHarvestRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'id-invalido' },
        relations: ['farm', 'harvest', 'crop'],
      });
    });

    it('should throw NotFoundException if new farm is not found', async () => {
      const updateFarmCropHarvestDto: UpdateFarmCropHarvestDto = {
        farm: 'id-invalido',
      };

      mockFarmCropHarvestRepository.findOne.mockResolvedValue(
        mockFarmCropHarvest
      );
      mockFarmRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(mockFarmCropHarvest.id, updateFarmCropHarvestDto)
      ).rejects.toThrow(
        new NotFoundException(`Fazenda com ID id-invalido não encontrada`)
      );
      expect(mockFarmRepository.findOneBy).toHaveBeenCalledWith({
        id: 'id-invalido',
      });
    });

    it('should throw NotFoundException if new harvest is not found', async () => {
      const updateFarmCropHarvestDto: UpdateFarmCropHarvestDto = {
        harvest: 'id-invalido',
      };

      mockFarmCropHarvestRepository.findOne.mockResolvedValue(
        mockFarmCropHarvest
      );
      mockHarvestRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(mockFarmCropHarvest.id, updateFarmCropHarvestDto)
      ).rejects.toThrow(
        new NotFoundException(`Safra com ID id-invalido não encontrada`)
      );
      expect(mockHarvestRepository.findOneBy).toHaveBeenCalledWith({
        id: 'id-invalido',
      });
    });

    it('should throw NotFoundException if new crop is not found', async () => {
      const updateFarmCropHarvestDto: UpdateFarmCropHarvestDto = {
        crop: 'id-invalido',
      };

      mockFarmCropHarvestRepository.findOne.mockResolvedValue(
        mockFarmCropHarvest
      );
      mockCropRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(mockFarmCropHarvest.id, updateFarmCropHarvestDto)
      ).rejects.toThrow(
        new NotFoundException(`Cultura com ID id-invalido não encontrada`)
      );
      expect(mockCropRepository.findOneBy).toHaveBeenCalledWith({
        id: 'id-invalido',
      });
    });
  });

  describe('delete', () => {
    it('should delete an association successfully', async () => {
      mockFarmCropHarvestRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(mockFarmCropHarvest.id);

      expect(mockFarmCropHarvestRepository.delete).toHaveBeenCalledWith(
        mockFarmCropHarvest.id
      );
    });

    it('should throw NotFoundException if association to delete is not found', async () => {
      mockFarmCropHarvestRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete('id-invalido')).rejects.toThrow(
        new NotFoundException(
          `Fazenda Safra Cultura com ID id-invalido não encontrada`
        )
      );
      expect(mockFarmCropHarvestRepository.delete).toHaveBeenCalledWith(
        'id-invalido'
      );
    });
  });
});

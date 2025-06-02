import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CropService } from '../../src/modules/farm/crop.service';
import { Crop } from '../../src/modules/farm/entities/crop.entity';
import { CreateCropDto } from '../../src/modules/farm/dtos/create-crop.dto';
import { UpdateCropDto } from '../../src/modules/farm/dtos/update-crop.dto';
import { NotFoundException } from '@nestjs/common';

describe('CropService', () => {
  let service: CropService;

  const mockCrop = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    crop_name: 'Soja',
  };

  const mockCropRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropService,
        {
          provide: getRepositoryToken(Crop),
          useValue: mockCropRepository,
        },
      ],
    }).compile();

    service = module.get<CropService>(CropService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a crop', async () => {
      const createCropDto: CreateCropDto = { crop_name: 'Soja' };
      mockCropRepository.create.mockReturnValue(mockCrop);
      mockCropRepository.save.mockResolvedValue(mockCrop);

      const result = await service.create(createCropDto);

      expect(mockCropRepository.create).toHaveBeenCalledWith(createCropDto);
      expect(mockCropRepository.save).toHaveBeenCalledWith(mockCrop);
      expect(result).toEqual(mockCrop);
    });
  });

  describe('findAll', () => {
    it('should return an array of crops', async () => {
      const crops = [
        mockCrop,
        { ...mockCrop, id: 'another-uuid', crop_name: 'Milho' },
      ];
      mockCropRepository.find.mockResolvedValue(crops);

      const result = await service.findAll();

      expect(mockCropRepository.find).toHaveBeenCalled();
      expect(result).toEqual(crops);
    });

    it('should return an empty array if no crops exist', async () => {
      mockCropRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockCropRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a crop by ID', async () => {
      mockCropRepository.findOneBy.mockResolvedValue(mockCrop);

      const result = await service.findOne(mockCrop.id);

      expect(mockCropRepository.findOneBy).toHaveBeenCalledWith({
        id: mockCrop.id,
      });
      expect(result).toEqual(mockCrop);
    });

    it('should throw NotFoundException if crop is not found', async () => {
      mockCropRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new NotFoundException(`Cultura com o ID invalid-id não encontrada`)
      );
      expect(mockCropRepository.findOneBy).toHaveBeenCalledWith({
        id: 'invalid-id',
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated crop', async () => {
      const updateCropDto: UpdateCropDto = { crop_name: 'Milho' };
      const updatedCrop = { ...mockCrop, crop_name: 'Milho' };
      mockCropRepository.findOneBy.mockResolvedValue(mockCrop);
      mockCropRepository.save.mockResolvedValue(updatedCrop);

      const result = await service.update(mockCrop.id, updateCropDto);

      expect(mockCropRepository.findOneBy).toHaveBeenCalledWith({
        id: mockCrop.id,
      });
      expect(mockCropRepository.save).toHaveBeenCalledWith(updatedCrop);
      expect(result).toEqual(updatedCrop);
    });

    it('should throw NotFoundException if crop to update is not found', async () => {
      mockCropRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', { crop_name: 'Milho' })
      ).rejects.toThrow(
        new NotFoundException(`Cultura com o ID invalid-id não encontrada`)
      );
      expect(mockCropRepository.findOneBy).toHaveBeenCalledWith({
        id: 'invalid-id',
      });
    });
  });

  describe('remove', () => {
    it('should remove a crop successfully', async () => {
      mockCropRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(mockCrop.id);

      expect(mockCropRepository.delete).toHaveBeenCalledWith(mockCrop.id);
    });

    it('should throw NotFoundException if crop to remove is not found', async () => {
      mockCropRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('invalid-id')).rejects.toThrow(
        new NotFoundException(`Cultura com o ID invalid-id não encontrada`)
      );
      expect(mockCropRepository.delete).toHaveBeenCalledWith('invalid-id');
    });
  });
});

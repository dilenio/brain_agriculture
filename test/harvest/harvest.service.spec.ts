import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HarvestService } from '../../src/modules/farm/harvest.service';
import { Harvest } from '../../src/modules/farm/entities/harvest.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('HarvestService', () => {
  let service: HarvestService;
  let repository: Repository<Harvest>;

  const mockHarvest = { id: '1', harvest_name: 'Safra 2025' };
  const mockHarvestRepository = {
    create: jest.fn().mockReturnValue(mockHarvest),
    save: jest.fn().mockResolvedValue(mockHarvest),
    find: jest.fn().mockResolvedValue([mockHarvest]),
    findOneBy: jest.fn().mockResolvedValue(mockHarvest),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(() => {
    mockHarvestRepository.findOneBy.mockReset();
    mockHarvestRepository.findOneBy.mockResolvedValue(mockHarvest);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestService,
        {
          provide: getRepositoryToken(Harvest),
          useValue: mockHarvestRepository,
        },
      ],
    }).compile();

    service = module.get<HarvestService>(HarvestService);
    repository = module.get<Repository<Harvest>>(getRepositoryToken(Harvest));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a harvest', async () => {
      const createHarvestDto = { harvest_name: 'Safra 2025' };
      const result = await service.create(createHarvestDto);
      expect(repository.create).toHaveBeenCalledWith(createHarvestDto);
      expect(repository.save).toHaveBeenCalledWith(mockHarvest);
      expect(result).toEqual(mockHarvest);
    });
  });

  describe('findAll', () => {
    it('should return an array of harvests', async () => {
      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockHarvest]);
    });
  });

  describe('findOne', () => {
    it('should return a harvest by ID', async () => {
      const result = await service.findOne('1');
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(mockHarvest);
    });

    it('should throw NotFoundException if harvest not found', async () => {
      mockHarvestRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('2')).rejects.toThrow(
        new NotFoundException('Safra com ID 2 não encontrado')
      );
    });
  });

  describe('update', () => {
    it('should update and return a harvest', async () => {
      const updateHarvestDto = { harvest_name: 'Safra 2026' };
      const result = await service.update('1', updateHarvestDto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockHarvest,
        ...updateHarvestDto,
      });
      expect(result).toEqual({ ...mockHarvest, ...updateHarvestDto });
    });

    it('should throw NotFoundException if harvest not found', async () => {
      mockHarvestRepository.findOneBy.mockResolvedValue(null);
      await expect(
        service.update('2', { harvest_name: 'Safra 2026' })
      ).rejects.toThrow(new NotFoundException('Safra com ID 2 não encontrado'));
    });
  });

  describe('remove', () => {
    it('should delete a harvest', async () => {
      await service.remove('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if harvest not found', async () => {
      mockHarvestRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('2')).rejects.toThrow(
        new NotFoundException('Safra com ID 2 não encontrado')
      );
    });
  });
});

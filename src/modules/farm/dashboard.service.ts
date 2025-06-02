import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../farm/entities/farm.entity';
import { FarmCropHarvest } from './entities/farm-crop-harvest.entity';
import { DashboardResponseDto } from './dtos/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
    @InjectRepository(FarmCropHarvest)
    private farmCropHarvestRepository: Repository<FarmCropHarvest>
  ) {}

  async getDashboardData(): Promise<DashboardResponseDto> {
    // Total de fazendas
    const totalFarms = await this.farmRepository.count();

    // Total de hectares
    const totalHectaresResult = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.total_farm_area)', 'total')
      .getRawOne();
    const totalHectares = parseFloat(totalHectaresResult?.total || '0');

    // Distribuição por estado
    const byState = await this.farmRepository
      .createQueryBuilder('farm')
      .select('farm.state', 'state')
      .addSelect('COUNT(*)', 'count')
      .groupBy('farm.state')
      .orderBy('farm.state', 'ASC')
      .getRawMany()
      .then((results) =>
        results.map((result) => ({
          state: result.state,
          count: parseInt(result.count, 10),
        }))
      );

    // Distribuição por cultura
    const byCrop = await this.farmCropHarvestRepository
      .createQueryBuilder('fch')
      .innerJoin('fch.crop', 'crop')
      .select('crop.crop_name', 'crop')
      .addSelect('COUNT(*)', 'count')
      .groupBy('crop.crop_name')
      .orderBy('crop.crop_name', 'ASC')
      .getRawMany()
      .then((results) =>
        results.map((result) => ({
          crop: result.crop,
          count: parseInt(result.count, 10),
        }))
      );

    // Uso do solo
    const landUseResult = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.arable_area)', 'arableArea')
      .addSelect('SUM(farm.vegetation_area)', 'vegetationArea')
      .getRawOne();
    const byLandUse = {
      arableArea: parseFloat(landUseResult?.arableArea || '0'),
      vegetationArea: parseFloat(landUseResult?.vegetationArea || '0'),
    };

    return {
      totalFarms,
      totalHectares,
      byState,
      byCrop,
      byLandUse,
    };
  }
}

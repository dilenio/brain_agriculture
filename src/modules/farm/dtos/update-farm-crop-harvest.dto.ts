import { PartialType } from '@nestjs/mapped-types';
import { CreateFarmCropHarvestDto } from './create-farm-crop-harvest.dto';

export class UpdateFarmCropHarvestDto extends PartialType(
  CreateFarmCropHarvestDto
) {}

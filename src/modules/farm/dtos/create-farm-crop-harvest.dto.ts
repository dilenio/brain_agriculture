import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmCropHarvestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  farm_id!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  harvest_id!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  crop_id!: string;
}

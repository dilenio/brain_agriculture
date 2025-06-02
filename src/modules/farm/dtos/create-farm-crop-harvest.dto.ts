import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmCropHarvestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  farm!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  harvest!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  crop!: string;
}

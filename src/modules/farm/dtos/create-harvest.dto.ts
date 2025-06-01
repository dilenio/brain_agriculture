import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHarvestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  harvest_name!: string;
}

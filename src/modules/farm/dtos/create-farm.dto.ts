import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  farm_name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  producer_id!: string;
}

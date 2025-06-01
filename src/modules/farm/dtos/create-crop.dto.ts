import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCropDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  crop_name!: string;
}

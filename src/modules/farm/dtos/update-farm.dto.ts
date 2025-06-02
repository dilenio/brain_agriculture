import {
  IsString,
  IsPositive,
  Max,
  IsOptional,
  Validate,
  IsInt,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  AreaNotExceedTotalConstraint,
  AreaSumConstraint,
} from './create-farm.dto';

export class UpdateFarmDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  farm_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  state?: string;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(99999999)
  total_farm_area?: number;

  @ApiProperty({ example: 80, required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(99999999)
  arable_area?: number;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(99999999)
  vegetation_area?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  producerId?: string;

  @ValidateIf(
    (o) =>
      o.total_farm_area !== undefined ||
      o.arable_area !== undefined ||
      o.vegetation_area !== undefined
  )
  @Validate(AreaSumConstraint)
  @Validate(AreaNotExceedTotalConstraint, ['arable_area'])
  @Validate(AreaNotExceedTotalConstraint, ['vegetation_area'])
  private areaValidation?: boolean;
}

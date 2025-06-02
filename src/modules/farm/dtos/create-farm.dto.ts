import {
  IsString,
  IsNotEmpty,
  IsPositive,
  Max,
  Validate,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  AreaNotExceedTotalConstraint,
  AreaSumConstraint,
} from '../../../common/validators/area.validator';

export class CreateFarmDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  farm_name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @IsPositive()
  @Max(99999999)
  @IsNotEmpty()
  @Validate(AreaSumConstraint)
  total_farm_area!: number;

  @ApiProperty({ example: 80 })
  @IsInt()
  @IsPositive()
  @Max(99999999)
  @IsNotEmpty()
  @Validate(AreaNotExceedTotalConstraint)
  arable_area!: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @IsPositive()
  @Max(99999999)
  @IsNotEmpty()
  @Validate(AreaNotExceedTotalConstraint)
  vegetation_area!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  producerId!: string;
}

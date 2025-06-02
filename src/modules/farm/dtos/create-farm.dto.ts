import {
  IsString,
  IsNotEmpty,
  IsPositive,
  Max,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'AreaSumConstraint', async: false })
export class AreaSumConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    const { total_farm_area, arable_area, vegetation_area } = args.object;
    if (
      arable_area != null &&
      vegetation_area != null &&
      total_farm_area != null
    ) {
      return arable_area + vegetation_area <= total_farm_area;
    }
    return true;
  }

  defaultMessage() {
    return 'The sum of arable_area and vegetation_area must not exceed total_farm_area.';
  }
}

@ValidatorConstraint({ name: 'AreaNotExceedTotalConstraint', async: false })
export class AreaNotExceedTotalConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: any) {
    const { total_farm_area } = args.object;
    if (value != null && total_farm_area != null) {
      return value <= total_farm_area;
    }
    return true;
  }

  defaultMessage(args: any) {
    return `${args.property} must not exceed total_farm_area.`;
  }
}

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

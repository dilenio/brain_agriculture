import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

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
    return 'A soma de arable_area e vegetation_area não deve exceder a total_farm_area.';
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
    return `${args.property} não deve exceder a total_farm_area.`;
  }
}

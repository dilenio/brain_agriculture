import {
  AreaSumConstraint,
  AreaNotExceedTotalConstraint,
} from '../../src/common/validators/area.validator';

describe('Farm Constraints', () => {
  let areaSumConstraint: AreaSumConstraint;
  let areaNotExceedTotalConstraint: AreaNotExceedTotalConstraint;

  beforeEach(() => {
    areaSumConstraint = new AreaSumConstraint();
    areaNotExceedTotalConstraint = new AreaNotExceedTotalConstraint();
  });

  describe('AreaSumConstraint', () => {
    const createArgs = (
      total_farm_area: number | null,
      arable_area: number | null,
      vegetation_area: number | null
    ) => ({
      object: { total_farm_area, arable_area, vegetation_area },
    });

    it('should return true when arable_area + vegetation_area is less than total_farm_area', () => {
      const args = createArgs(100, 60, 30);
      const result = areaSumConstraint.validate(null, args);
      expect(result).toBe(true);
    });

    it('should return true when arable_area + vegetation_area equals total_farm_area', () => {
      const args = createArgs(100, 70, 30);
      const result = areaSumConstraint.validate(null, args);
      expect(result).toBe(true);
    });

    it('should return false when arable_area + vegetation_area exceeds total_farm_area', () => {
      const args = createArgs(100, 80, 50);
      const result = areaSumConstraint.validate(null, args);
      expect(result).toBe(false);
    });

    it('should return true when any area is null', () => {
      let args = createArgs(null, 60, 30);
      expect(areaSumConstraint.validate(null, args)).toBe(true);

      args = createArgs(100, null, 30);
      expect(areaSumConstraint.validate(null, args)).toBe(true);

      args = createArgs(100, 60, null);
      expect(areaSumConstraint.validate(null, args)).toBe(true);
    });

    it('should return correct default message', () => {
      const message = areaSumConstraint.defaultMessage();
      expect(message).toBe(
        'A soma de arable_area e vegetation_area não deve exceder a total_farm_area.'
      );
    });
  });

  describe('AreaNotExceedTotalConstraint', () => {
    const createArgs = (
      total_farm_area: number | null,
      value: number | null,
      property: string
    ) => ({
      object: { total_farm_area },
      property,
    });

    it('should return true when value is less than total_farm_area', () => {
      const args = createArgs(100, 80, 'arable_area');
      const result = areaNotExceedTotalConstraint.validate(80, args);
      expect(result).toBe(true);
    });

    it('should return true when value equals total_farm_area', () => {
      const args = createArgs(100, 100, 'arable_area');
      const result = areaNotExceedTotalConstraint.validate(100, args);
      expect(result).toBe(true);
    });

    it('should return false when value exceeds total_farm_area', () => {
      const args = createArgs(100, 120, 'arable_area');
      const result = areaNotExceedTotalConstraint.validate(120, args);
      expect(result).toBe(false);
    });

    it('should return true when value is null', () => {
      const args = createArgs(100, null, 'arable_area');
      const result = areaNotExceedTotalConstraint.validate(null, args);
      expect(result).toBe(true);
    });

    it('should return true when total_farm_area is null', () => {
      const args = createArgs(null, 80, 'arable_area');
      const result = areaNotExceedTotalConstraint.validate(80, args);
      expect(result).toBe(true);
    });

    it('should return correct default message for arable_area', () => {
      const args = createArgs(100, 120, 'arable_area');
      const message = areaNotExceedTotalConstraint.defaultMessage(args);
      expect(message).toBe('arable_area não deve exceder a total_farm_area.');
    });

    it('should return correct default message for vegetation_area', () => {
      const args = createArgs(100, 120, 'vegetation_area');
      const message = areaNotExceedTotalConstraint.defaultMessage(args);
      expect(message).toBe(
        'vegetation_area não deve exceder a total_farm_area.'
      );
    });
  });
});

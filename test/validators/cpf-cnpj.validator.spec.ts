import { ValidationArguments } from 'class-validator';
import { CpfCnpjConstraint } from '../../src/common/validators/cpf-cnpj.validator';

describe('CpfCnpjConstraint', () => {
  let constraint: CpfCnpjConstraint;

  beforeEach(() => {
    constraint = new CpfCnpjConstraint();
  });

  describe('validate', () => {
    it('should return true for a valid CPF with formatting', () => {
      const value = '123.456.789-09';
      expect(constraint.validate(value)).toBe(true);
    });

    it('should return true for a valid CPF without formatting', () => {
      const value = '12345678909';
      expect(constraint.validate(value)).toBe(true);
    });

    it('should return true for a valid CNPJ with formatting', () => {
      const value = '12.345.678/0001-95';
      expect(constraint.validate(value)).toBe(true);
    });

    it('should return true for a valid CNPJ without formatting', () => {
      const value = '12345678000195';
      expect(constraint.validate(value)).toBe(true);
    });

    it('should return false for an empty string', () => {
      const value = '';
      expect(constraint.validate(value)).toBe(false);
    });

    it('should return false for null', () => {
      const value = null;
      expect(constraint.validate(value)).toBe(false);
    });

    it('should return false for undefined', () => {
      const value = undefined;
      expect(constraint.validate(value)).toBe(false);
    });

    it('should return false for a CPF with invalid length', () => {
      const value = '123456789';
      expect(constraint.validate(value)).toBe(false);
    });

    it('should return false for a CNPJ with invalid length', () => {
      const value = '1234567890123';
      expect(constraint.validate(value)).toBe(false);
    });

    it('should return false for a CPF with repeated digits', () => {
      const value = '11111111111';
      expect(constraint.validate(value)).toBe(false);
    });

    it('should return false for a CNPJ with repeated digits', () => {
      const value = '00000000000000';
      expect(constraint.validate(value)).toBe(false);
    });

    it('should return false for a CPF with invalid check digits', () => {
      const value = '123.456.789-00';
      expect(constraint.validate(value)).toBe(false);
    });

    it('should return false for a CNPJ with invalid check digits', () => {
      const value = '12.345.678/0001-00';
      expect(constraint.validate(value)).toBe(false);
    });

    it('should return false for a number value', () => {
      const value = 12345678909 as any;
      expect(constraint.validate(value)).toBe(false);
    });

    it('should return false for an object value', () => {
      const value = { cpf: '12345678909' } as any;
      expect(constraint.validate(value)).toBe(false);
    });

    it('should return false for a boolean value', () => {
      const value = true as any;
      expect(constraint.validate(value)).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the correct error message with property name', () => {
      const args: ValidationArguments = {
        property: 'cpf_cnpj',
        value: 'invalid',
        targetName: '',
        constraints: [],
        object: {},
      };
      expect(constraint.defaultMessage(args)).toBe(
        'cpf_cnpj deve ser um CPF ou CNPJ válido'
      );
    });
  });
});

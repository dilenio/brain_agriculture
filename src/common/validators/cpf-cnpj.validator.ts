import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'CpfCnpj', async: false })
export class CpfCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (!value) return false;

    const cleanValue = value.replace(/[^\d]/g, '');

    if (cleanValue.length !== 11 && cleanValue.length !== 14) {
      return false;
    }

    if (cleanValue.length === 11) {
      // Verifica sequências repetidas
      if (/^(\d)\1+$/.test(cleanValue)) return false;

      // Cálculo dos dígitos verificadores
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanValue[i]) * (10 - i);
      }
      let firstDigit = 11 - (sum % 11);
      if (firstDigit >= 10) firstDigit = 0;

      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanValue[i]) * (11 - i);
      }
      let secondDigit = 11 - (sum % 11);
      if (secondDigit >= 10) secondDigit = 0;

      return (
        parseInt(cleanValue[9]) === firstDigit &&
        parseInt(cleanValue[10]) === secondDigit
      );
    }

    if (cleanValue.length === 14) {
      // Verifica sequências repetidas
      if (/^(\d)\1+$/.test(cleanValue)) return false;

      // Cálculo do primeiro dígito verificador
      const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(cleanValue[i]) * weights1[i];
      }
      let firstDigit = 11 - (sum % 11);
      if (firstDigit >= 10) firstDigit = 0;

      // Cálculo do segundo dígito verificador
      const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      sum = 0;
      for (let i = 0; i < 13; i++) {
        sum += parseInt(cleanValue[i]) * weights2[i];
      }
      let secondDigit = 11 - (sum % 11);
      if (secondDigit >= 10) secondDigit = 0;

      return (
        parseInt(cleanValue[12]) === firstDigit &&
        parseInt(cleanValue[13]) === secondDigit
      );
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid Brazilian CPF or CNPJ.`;
  }
}

import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CpfCnpjConstraint } from '../../../common/validators/cpf-cnpj.validator';

export class CreateProducerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  producer_name!: string;

  @ApiProperty({ example: '123.456.789-09 or 12.345.678/0001-95' })
  @IsString()
  @IsNotEmpty()
  @Validate(CpfCnpjConstraint)
  cpf_cnpj!: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateProducerDto } from './create-producer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, Validate } from 'class-validator';
import { CpfCnpjConstraint } from '../../../common/validators/cpf-cnpj.validator';

export class UpdateProducerDto extends PartialType(CreateProducerDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  producer_name?: string;

  @ApiProperty({
    example: '123.456.789-09 or 12.345.678/0001-95',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Validate(CpfCnpjConstraint)
  cpf_cnpj?: string;
}

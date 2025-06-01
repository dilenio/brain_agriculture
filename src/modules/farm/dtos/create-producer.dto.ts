import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProducerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  producer_name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cpf_cnpj!: string;
}

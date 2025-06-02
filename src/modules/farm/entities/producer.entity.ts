import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Farm } from './farm.entity';
import { Transform } from 'class-transformer';

@Entity()
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @Column()
  @ApiProperty()
  producer_name!: string;

  @Column()
  @ApiProperty({ example: '123.456.789-09 or 12.345.678/0001-95' })
  @Transform(({ value }) => {
    if (!value || typeof value !== 'string') return value;
    if (value.length === 11) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    if (value.length === 14) {
      return value.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    }
    return value;
  })
  cpf_cnpj!: string;

  @OneToMany(() => Farm, (farm) => farm.producer)
  @ApiProperty({ type: () => [Farm] })
  farms!: Farm[];
}

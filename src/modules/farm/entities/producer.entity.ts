import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Farm } from './farm.entity';

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
  cpf_cnpj!: string;

  @OneToMany(() => Farm, (farm) => farm.producer)
  @ApiProperty({ type: () => [Farm] })
  farms!: Farm[];
}

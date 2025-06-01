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
  @ApiProperty()
  cpf_cnpj!: string;

  @OneToMany(() => Farm, (farm) => farm.producer)
  @ApiProperty({ type: () => [Farm] })
  farms!: Farm[];
}

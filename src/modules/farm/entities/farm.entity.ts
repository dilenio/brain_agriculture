import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FarmCropHarvest } from './farm-crop-harvest.entity';
import { Producer } from './producer.entity';

@Entity()
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @Column()
  @ApiProperty()
  farm_name!: string;

  @Column()
  @ApiProperty()
  city!: string;

  @Column()
  @ApiProperty()
  state!: string;

  @Column({ type: 'integer' })
  @ApiProperty({ example: 100 })
  total_farm_area!: number;

  @Column({ type: 'integer' })
  @ApiProperty({ example: 80 })
  arable_area!: number;

  @Column({ type: 'integer' })
  @ApiProperty({ example: 20.0 })
  vegetation_area!: number;

  @ManyToOne(() => Producer, (producer) => producer.farms, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => Producer })
  producer!: Producer;

  @OneToMany(() => FarmCropHarvest, (farmCropHarvest) => farmCropHarvest.farm)
  @ApiProperty({ type: () => [FarmCropHarvest] })
  crops_harvests!: FarmCropHarvest[];
}

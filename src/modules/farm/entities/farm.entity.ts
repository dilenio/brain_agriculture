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

  @ManyToOne(() => Producer, (producer) => producer.farms, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => Producer })
  producer!: Producer;

  @OneToMany(() => FarmCropHarvest, (farmCropHarvest) => farmCropHarvest.farm)
  @ApiProperty({ type: () => [FarmCropHarvest] })
  crops_harvests!: FarmCropHarvest[];
}

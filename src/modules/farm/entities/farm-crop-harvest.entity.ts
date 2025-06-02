import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Farm } from './farm.entity';
import { Harvest } from './harvest.entity';
import { Crop } from './crop.entity';

@Entity()
export class FarmCropHarvest {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @ManyToOne(() => Farm, (farm) => farm.crops_harvests, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => Farm })
  farm!: Farm;

  @ManyToOne(() => Harvest, (harvest) => harvest, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Harvest })
  harvest!: Harvest;

  @ManyToOne(() => Crop, (crop) => crop, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Crop })
  crop!: Crop;
}

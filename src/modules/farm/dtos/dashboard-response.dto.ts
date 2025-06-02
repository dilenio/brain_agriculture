import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsObject } from 'class-validator';

export class DashboardResponseDto {
  @ApiProperty({ description: 'Total de fazendas cadastradas', example: 50 })
  @IsNumber()
  totalFarms!: number;

  @ApiProperty({
    description: 'Total de hectares registrados',
    example: 12500.5,
  })
  @IsNumber()
  totalHectares!: number;

  @ApiProperty({
    description: 'Distribuição de fazendas por estado',
    example: [
      { state: 'MG', count: 20 },
      { state: 'SP', count: 15 },
    ],
  })
  @IsArray()
  byState!: { state: string; count: number }[];

  @ApiProperty({
    description: 'Distribuição de culturas plantadas',
    example: [
      { crop: 'Soja', count: 30 },
      { crop: 'Milho', count: 25 },
    ],
  })
  @IsArray()
  byCrop!: { crop: string; count: number }[];

  @ApiProperty({
    description: 'Distribuição de uso do solo',
    example: { arableArea: 8000, vegetationArea: 4500 },
  })
  @IsObject()
  byLandUse!: { arableArea: number; vegetationArea: number };
}

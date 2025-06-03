import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FarmCropHarvestService } from './farm-crop-harvest.service';
import { CreateFarmCropHarvestDto } from './dtos/create-farm-crop-harvest.dto';
import { UpdateFarmCropHarvestDto } from './dtos/update-farm-crop-harvest.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { FarmCropHarvest } from './entities/farm-crop-harvest.entity';
import { ApiResponseDecorator } from '../../common/decorators/api-response.decorator';

@ApiTags('fazenda-safra-cultura')
@Controller('fazenda-safra-cultura')
export class FarmCropHarvestController {
  constructor(
    private readonly farmCropHarvestService: FarmCropHarvestService
  ) {}

  @Post()
  @ApiResponseDecorator(
    'Criar uma nova associação entre fazenda, cultura e safra'
  )
  @ApiResponse({ status: 201, type: FarmCropHarvest })
  create(@Body() createFarmCropHarvestDto: CreateFarmCropHarvestDto) {
    return this.farmCropHarvestService.create(createFarmCropHarvestDto);
  }

  @Get()
  @ApiResponseDecorator(
    'Listar todas as associações entre fazenda, cultura e safra'
  )
  @ApiResponse({ status: 200, type: [FarmCropHarvest] })
  findAll() {
    return this.farmCropHarvestService.findAll();
  }

  @Get(':id')
  @ApiResponseDecorator(
    'Buscar uma associação entre fazenda, cultura e safra pelo ID'
  )
  @ApiResponse({ status: 200, type: FarmCropHarvest })
  findOne(@Param('id') id: string) {
    return this.farmCropHarvestService.findOne(id);
  }

  @Patch(':id')
  @ApiResponseDecorator(
    'Atualizar uma associação entre fazenda, cultura e safra'
  )
  @ApiResponse({ status: 200, type: FarmCropHarvest })
  update(
    @Param('id') id: string,
    @Body() updateFarmCropHarvestDto: UpdateFarmCropHarvestDto
  ) {
    return this.farmCropHarvestService.update(id, updateFarmCropHarvestDto);
  }

  @Delete(':id')
  @ApiResponseDecorator('Apagar uma associação entre fazenda, cultura e safra ')
  @ApiResponse({ status: 204 })
  delete(@Param('id') id: string) {
    return this.farmCropHarvestService.delete(id);
  }
}

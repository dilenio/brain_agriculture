import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { CreateHarvestDto } from './dtos/create-harvest.dto';
import { UpdateHarvestDto } from './dtos/update-harvest.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Harvest } from './entities/harvest.entity';
import { ApiResponseDecorator } from '../../common/decorators/api-response.decorator';

@ApiTags('harvests')
@Controller('harvests')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Post()
  @ApiResponseDecorator('Criar uma nova safra')
  @ApiResponse({ status: 201, type: Harvest })
  create(@Body() createHarvestDto: CreateHarvestDto) {
    return this.harvestService.create(createHarvestDto);
  }

  @Get()
  @ApiResponseDecorator('Listar todas as safras')
  @ApiResponse({ status: 200, type: [Harvest] })
  findAll() {
    return this.harvestService.findAll();
  }

  @Get(':id')
  @ApiResponseDecorator('Buscar uma safra pelo ID')
  @ApiResponse({ status: 200, type: Harvest })
  findOne(@Param('id') id: string) {
    return this.harvestService.findOne(id);
  }

  @Patch(':id')
  @ApiResponseDecorator('Atualizar uma safra')
  @ApiResponse({ status: 200, type: Harvest })
  update(@Param('id') id: string, @Body() updateHarvestDto: UpdateHarvestDto) {
    return this.harvestService.update(id, updateHarvestDto);
  }

  @Delete(':id')
  @ApiResponseDecorator('Apagar uma safra')
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.harvestService.remove(id);
  }
}

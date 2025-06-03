import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CropService } from './crop.service';
import { CreateCropDto } from './dtos/create-crop.dto';
import { UpdateCropDto } from './dtos/update-crop.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Crop } from './entities/crop.entity';
import { ApiResponseDecorator } from '../../common/decorators/api-response.decorator';

@ApiTags('culturas')
@Controller('culturas')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post()
  @ApiResponseDecorator('Criar uma nova cultura')
  @ApiResponse({ status: 201, type: Crop })
  create(@Body() createCropDto: CreateCropDto) {
    return this.cropService.create(createCropDto);
  }

  @Get()
  @ApiResponseDecorator('Listar todas as culturas')
  @ApiResponse({ status: 200, type: [Crop] })
  findAll() {
    return this.cropService.findAll();
  }

  @Get(':id')
  @ApiResponseDecorator('Buscar uma cultura pelo ID')
  @ApiResponse({ status: 200, type: Crop })
  findOne(@Param('id') id: string) {
    return this.cropService.findOne(id);
  }

  @Patch(':id')
  @ApiResponseDecorator('Atualizar uma cultura')
  @ApiResponse({ status: 200, type: Crop })
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropService.update(id, updateCropDto);
  }

  @Delete(':id')
  @ApiResponseDecorator('Apagar uma cultura')
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.cropService.remove(id);
  }
}

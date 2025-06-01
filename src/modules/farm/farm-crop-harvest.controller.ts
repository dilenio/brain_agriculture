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

@ApiTags('farm-crop-harvests')
@Controller('farm-crop-harvests')
export class FarmCropHarvestController {
  constructor(
    private readonly farmCropHarvestService: FarmCropHarvestService
  ) {}

  @Post()
  @ApiResponseDecorator('Create a new farm-crop-harvest association')
  @ApiResponse({ status: 201, type: FarmCropHarvest })
  create(@Body() createFarmCropHarvestDto: CreateFarmCropHarvestDto) {
    return this.farmCropHarvestService.create(createFarmCropHarvestDto);
  }

  @Get()
  @ApiResponseDecorator('Retrieve all farm-crop-harvest associations')
  @ApiResponse({ status: 200, type: [FarmCropHarvest] })
  findAll() {
    return this.farmCropHarvestService.findAll();
  }

  @Get(':id')
  @ApiResponseDecorator('Retrieve a farm-crop-harvest association by ID')
  @ApiResponse({ status: 200, type: FarmCropHarvest })
  findOne(@Param('id') id: string) {
    return this.farmCropHarvestService.findOne(id);
  }

  @Patch(':id')
  @ApiResponseDecorator('Update a farm-crop-harvest association')
  @ApiResponse({ status: 200, type: FarmCropHarvest })
  update(
    @Param('id') id: string,
    @Body() updateFarmCropHarvestDto: UpdateFarmCropHarvestDto
  ) {
    return this.farmCropHarvestService.update(id, updateFarmCropHarvestDto);
  }

  @Delete(':id')
  @ApiResponseDecorator('Delete a farm-crop-harvest association')
  @ApiResponse({ status: 204 })
  delete(@Param('id') id: string) {
    return this.farmCropHarvestService.delete(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dtos/create-farm.dto';
import { UpdateFarmDto } from './dtos/update-farm.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Farm } from './entities/farm.entity';
import { ApiResponseDecorator } from '../../common/decorators/api-response.decorator';

@ApiTags('farms')
@Controller('farms')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @ApiResponseDecorator('Create a new farm')
  @ApiResponse({ status: 201, type: Farm })
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.create(createFarmDto);
  }

  @Get()
  @ApiResponseDecorator('Retrieve all farms')
  @ApiResponse({ status: 200, type: [Farm] })
  findAll() {
    return this.farmService.findAll();
  }

  @Get(':id')
  @ApiResponseDecorator('Retrieve a farm by ID')
  @ApiResponse({ status: 200, type: Farm })
  findOne(@Param('id') id: string) {
    return this.farmService.findOne(id);
  }

  @Patch(':id')
  @ApiResponseDecorator('Update a farm')
  @ApiResponse({ status: 200, type: Farm })
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @ApiResponseDecorator('Delete a farm')
  @ApiResponse({ status: 204 })
  delete(@Param('id') id: string) {
    return this.farmService.delete(id);
  }
}

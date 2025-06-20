import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dtos/create-producer.dto';
import { UpdateProducerDto } from './dtos/update-producer.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Producer } from './entities/producer.entity';
import { ApiResponseDecorator } from '../../common/decorators/api-response.decorator';

@ApiTags('produtores')
@Controller('produtores')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  @ApiResponseDecorator('Criar um novo produtor')
  @ApiResponse({ status: 201, type: Producer })
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producerService.create(createProducerDto);
  }

  @Get()
  @ApiResponseDecorator('Listar todos os produtores')
  @ApiResponse({ status: 200, type: [Producer] })
  findAll() {
    return this.producerService.findAll();
  }

  @Get(':id')
  @ApiResponseDecorator('Buscar um produtor por ID')
  @ApiResponse({ status: 200, type: Producer })
  findOne(@Param('id') id: string) {
    return this.producerService.findOne(id);
  }

  @Patch(':id')
  @ApiResponseDecorator('Atualizar um produtor')
  @ApiResponse({ status: 200, type: Producer })
  update(
    @Param('id') id: string,
    @Body() updateProducerDto: UpdateProducerDto
  ) {
    return this.producerService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @ApiResponseDecorator('Apagar um produtor')
  @ApiResponse({ status: 204 })
  delete(@Param('id') id: string) {
    return this.producerService.delete(id);
  }
}

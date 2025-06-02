import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dtos/dashboard-response.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ApiResponseDecorator } from '../../common/decorators/api-response.decorator';

@ApiTags('dashboard')
@Controller('dashboard')
@UseInterceptors(ClassSerializerInterceptor)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiResponseDecorator('Obter dados para o dashboard')
  @ApiResponse({ status: 200, type: DashboardResponseDto })
  async getDashboardData(): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboardData();
  }
}

import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dtos/error-response.dto';

export function ApiResponseDecorator(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: ErrorResponseDto,
    })
  );
}

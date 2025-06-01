import { PartialType } from '@nestjs/swagger';
import { CreateCropDto } from '../../farm/dtos/create-crop.dto';

export class UpdateCropDto extends PartialType(CreateCropDto) {}

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ description: 'The title of the service' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The description of the service' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The Lucide icon name' })
  @IsString()
  @IsNotEmpty()
  iconName: string;

  @ApiProperty({ description: 'Display order', required: false, default: 0 })
  @IsInt()
  @IsOptional()
  order?: number;

  @ApiProperty({
    description: 'Is the service visible?',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

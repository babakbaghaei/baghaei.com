import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ description: 'The title of the service' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'The description of the service' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'The Lucide icon name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
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

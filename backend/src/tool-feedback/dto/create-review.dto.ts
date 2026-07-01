import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  toolSlug: string;

  @IsString()
  @IsOptional()
  @MaxLength(60)
  name?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  body?: string;

  // Honeypot — declared so forbidNonWhitelisted doesn't 400 real bots; the
  // service silently drops any submission that fills it. Real users never see it.
  @IsString()
  @IsOptional()
  @MaxLength(200)
  company?: string;
}

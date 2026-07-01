import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  toolSlug: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  issue: string;

  // Optional way to reach the reporter back (phone/email/telegram) — free text.
  @IsString()
  @IsOptional()
  @MaxLength(120)
  contact?: string;

  // Honeypot (see CreateReviewDto).
  @IsString()
  @IsOptional()
  @MaxLength(200)
  company?: string;
}

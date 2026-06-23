import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUrl,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateJobApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  position: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  @Matches(/^\+?[\d\s().-]{7,}$/, {
    message: 'phone must be a valid phone number',
  })
  phone?: string;

  @IsUrl({ require_protocol: true })
  @IsOptional()
  @MaxLength(500)
  portfolioUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  message?: string;

  // Honeypot — see CreateContactDto. Non-empty flags spam.
  @IsString()
  @IsOptional()
  @MaxLength(200)
  company?: string;
}

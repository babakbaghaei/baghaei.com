import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(254)
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  // Accepts international and Iranian formats: optional leading +, then digits
  // with optional spaces, dashes, dots, or parentheses (at least 7 digits).
  @Matches(/^\+?[\d\s().-]{7,}$/, {
    message: 'phone must be a valid phone number',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message: string;
}

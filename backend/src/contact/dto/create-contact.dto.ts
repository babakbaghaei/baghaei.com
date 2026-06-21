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

  // Honeypot: hidden from real users via CSS/aria. Bots tend to auto-fill any
  // field named like this, so a non-empty value flags a spam submission.
  // Declared here (not stripped by the whitelist ValidationPipe) so the service
  // can detect and silently drop it without signalling the bot.
  @IsString()
  @IsOptional()
  @MaxLength(200)
  company?: string;
}

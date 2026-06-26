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
  @MaxLength(254)
  // The form field is "شماره تماس یا ایمیل" (phone OR email), so accept either:
  //  - phone: optional leading +, then ≥7 digits with spaces/dashes/dots/parens
  //  - email: a standard local@domain.tld
  // Rejecting one or the other 400s real users who legitimately gave the form
  // exactly what it asked for.
  @Matches(/^(\+?[\d\s().-]{7,}|[^\s@]+@[^\s@]+\.[^\s@]+)$/, {
    message: 'لطفاً یک شماره تماس یا ایمیل معتبر وارد کنید',
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

import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // Required only when the account has 2FA enabled.
  @IsString()
  @IsOptional()
  twoFactorCode?: string;
}

import {
  Controller,
  Post,
  Body,
  Req,
  Logger,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface AuthedRequest {
  user: { userId: number; email: string; role: string };
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2FA challenge: if enabled, a valid TOTP code is required to complete login.
    if (user.twoFactorEnabled) {
      if (!loginDto.twoFactorCode) {
        return { twoFactorRequired: true };
      }
      if (!this.authService.verifyTwoFactor(user, loginDto.twoFactorCode)) {
        throw new UnauthorizedException('Invalid 2FA code');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  async logout(@Body('refresh_token') refreshToken: string) {
    await this.authService.logout(refreshToken);
    return { message: 'Logged out successfully' };
  }

  // --- 2FA enrollment (authenticated user) ---

  @Post('2fa/generate')
  @UseGuards(AuthGuard('jwt'))
  generateTwoFactor(@Req() req: AuthedRequest) {
    return this.authService.generateTwoFactor(req.user.userId);
  }

  @Post('2fa/enable')
  @UseGuards(AuthGuard('jwt'))
  enableTwoFactor(@Req() req: AuthedRequest, @Body('code') code: string) {
    return this.authService.enableTwoFactor(req.user.userId, code);
  }

  @Post('2fa/disable')
  @UseGuards(AuthGuard('jwt'))
  disableTwoFactor(@Req() req: AuthedRequest) {
    return this.authService.disableTwoFactor(req.user.userId);
  }
}

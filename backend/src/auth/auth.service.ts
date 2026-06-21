import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { SecurityService } from '../security/security.service';
import { TwoFactorService } from './two-factor.service';

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private securityService: SecurityService,
    private twoFactorService: TwoFactorService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: {
    id: number;
    email: string;
    name: string | null;
    role: Role;
  }): Promise<LoginResponse> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name || undefined,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const sanitizedData = this.securityService.sanitizeInput(registerDto);
    const hashedPassword = await bcrypt.hash(sanitizedData.password, 10);
    return this.prisma.user.create({
      data: {
        email: sanitizedData.email,
        password: hashedPassword,
        name: sanitizedData.name,
        role: Role.USER,
      },
    });
  }

  async logout(refreshToken?: string): Promise<void> {
    await Promise.resolve(
      this.logger.log(
        `User logged out: ${refreshToken ? 'token provided' : 'no token'}`,
      ),
    );
  }

  // --- Refresh token rotation ---
  // Verifies the refresh token and issues a brand-new access+refresh pair, so
  // the previous refresh token is replaced on every use (rotation). Full reuse
  // detection would additionally track issued tokens in the revocation store.
  async refresh(refreshToken?: string): Promise<LoginResponse> {
    if (!refreshToken) throw new UnauthorizedException('No refresh token');
    let payload: { sub: number };
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException('User no longer exists');
    return this.login({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  // --- Two-factor authentication (TOTP) ---

  /** Used during login: verify a code against the user's stored secret. */
  verifyTwoFactor(
    user: { twoFactorSecret?: string | null },
    code: string,
  ): boolean {
    if (!user.twoFactorSecret) return false;
    return this.twoFactorService.verify(code, user.twoFactorSecret);
  }

  /** Step 1 of enrollment: create a secret + QR (not yet enabled). */
  async generateTwoFactor(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const secret = this.twoFactorService.generateSecret();
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });
    const otpauthUrl = this.twoFactorService.keyuri(user.email, secret);
    const qrDataUrl = await this.twoFactorService.qrCodeDataUrl(otpauthUrl);
    return { otpauthUrl, qrDataUrl };
  }

  /** Step 2: confirm the user can produce a valid code, then turn 2FA on. */
  async enableTwoFactor(userId: number, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException('Two-factor not initialized');
    }
    if (!this.twoFactorService.verify(code, user.twoFactorSecret)) {
      throw new UnauthorizedException('Invalid 2FA code');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
    return { enabled: true };
  }

  async disableTwoFactor(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });
    return { enabled: false };
  }
}

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { KeycloakService } from './keycloak.service';
import { ConfigService } from '@nestjs/config';

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
    private keycloakService: KeycloakService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<LoginResponse> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(user: any) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
      },
    });
  }

  async authenticateWithKeycloak(code: string, redirectUri: string): Promise<LoginResponse> {
    try {
      // Exchange authorization code for tokens
      const tokens = await this.keycloakService.exchangeCodeForTokens(code, redirectUri);
      
      // Get user info from Keycloak
      const userInfo = await this.keycloakService.getUserInfo(tokens.access_token);
      
      // Create or update user in our database
      let user = await this.prisma.user.findUnique({
        where: { email: userInfo.email },
      });
      
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: userInfo.email,
            name: userInfo.name || userInfo.preferred_username,
            role: 'user',
          },
        });
      } else {
        // Update user info if needed
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            name: userInfo.name || userInfo.preferred_username,
          },
        });
      }

      // Generate our own JWT token for internal use
      const payload = { email: user.email, sub: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`Keycloak authentication failed: ${error.message}`);
      throw new UnauthorizedException('Keycloak authentication failed');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    // In a real implementation, you would add the refresh token to a blacklist
    // or revoke it with the identity provider
    this.logger.log('User logged out');
  }
}
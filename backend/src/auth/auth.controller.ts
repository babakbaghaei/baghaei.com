import { Controller, Post, Body, Get, Req, Res, UseGuards, Query, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string }) {
    return this.authService.register(body);
  }

  @Get('keycloak')
  async keycloakLogin(@Res() res: Response) {
    // Redirect to Keycloak for authentication
    const keycloakUrl = process.env.KEYCLOAK_AUTH_SERVER_URL || 'http://localhost:8080';
    const realm = process.env.KEYCLOAK_REALM || 'master';
    const clientId = process.env.KEYCLOAK_CLIENT_ID || 'nestjs-app';
    const redirectUri = `${process.env.API_BASE_URL || 'http://localhost:3001'}/auth/keycloak/callback`;

    const authorizationUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=openid profile email`;

    res.redirect(authorizationUrl);
  }

  @Get('keycloak/callback')
  async keycloakCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    if (!code) {
      return res.status(400).json({ error: 'Authorization code not provided' });
    }

    try {
      const result = await this.authService.authenticateWithKeycloak(code,
        `${process.env.API_BASE_URL || 'http://localhost:3001'}/auth/keycloak/callback`);

      // In a real app, you'd redirect to frontend with the token
      // For now, we'll return the token directly
      res.json(result);
    } catch (error) {
      this.logger.error(`Keycloak callback failed: ${error.message}`);
      res.status(401).json({ error: 'Authentication failed' });
    }
  }

  @Post('logout')
  async logout(@Body('refresh_token') refreshToken: string) {
    await this.authService.logout(refreshToken);
    return { message: 'Logged out successfully' };
  }
}

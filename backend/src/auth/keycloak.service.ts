import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Issuer, TokenSet } from 'openid-client';

export interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  id_token: string;
}

@Injectable()
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);
  private client: any;
  private readonly keycloakUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.keycloakUrl = this.configService.get<string>('KEYCLOAK_AUTH_SERVER_URL', 'http://localhost:8080');
    this.realm = this.configService.get<string>('KEYCLOAK_REALM', 'master');
    this.clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID', 'nestjs-app');
    this.clientSecret = this.configService.get<string>('KEYCLOAK_CLIENT_SECRET', '');

    this.initializeClient();
  }

  private async initializeClient() {
    try {
      // Discover the OpenID Connect endpoints
      const issuer = await Issuer.discover(`${this.keycloakUrl}/realms/${this.realm}`);
      this.client = new issuer.Client({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uris: [`${process.env.API_BASE_URL || 'http://localhost:3001'}/auth/keycloak/callback`],
        response_types: ['code'],
      });
    } catch (error) {
      this.logger.error(`Failed to initialize Keycloak client: ${error.message}`);
      throw error;
    }
  }

  async exchangeCodeForTokens(code: string, redirectUri: string): Promise<KeycloakTokenResponse> {
    try {
      const tokenSet = await this.client.grant({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      });

      return {
        access_token: tokenSet.access_token,
        refresh_token: tokenSet.refresh_token,
        expires_in: tokenSet.expires_in,
        refresh_expires_in: tokenSet.refresh_expires_in,
        token_type: tokenSet.token_type,
        id_token: tokenSet.id_token,
      };
    } catch (error) {
      this.logger.error(`Failed to exchange code for tokens: ${error.message}`);
      throw error;
    }
  }

  async getUserInfo(accessToken: string): Promise<any> {
    try {
      const userinfo = await this.client.userinfo(accessToken);
      return userinfo;
    } catch (error) {
      this.logger.error(`Failed to get user info: ${error.message}`);
      throw error;
    }
  }

  async introspectToken(token: string): Promise<any> {
    try {
      // Create a token set to validate the token
      const tokenSet = new TokenSet({ access_token: token });
      return this.client.introspect(tokenSet);
    } catch (error) {
      this.logger.error(`Failed to introspect token: ${error.message}`);
      throw error;
    }
  }
}
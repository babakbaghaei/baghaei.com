import { KeycloakConnectOptions, KeycloakConnectOptionsFactory } from 'nest-keycloak-connect';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakOptionsFactory implements KeycloakConnectOptionsFactory {
  constructor(private configService: ConfigService) {}

  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: this.configService.get<string>('KEYCLOAK_AUTH_SERVER_URL', 'http://localhost:8080'),
      realm: this.configService.get<string>('KEYCLOAK_REALM', 'master'),
      clientId: this.configService.get<string>('KEYCLOAK_CLIENT_ID', 'nestjs-app'),
      clientSecret: this.configService.get<string>('KEYCLOAK_CLIENT_SECRET', ''),
      cookieKey: this.configService.get<string>('KEYCLOAK_COOKIE_KEY', 'KEYCLOAK_JWT'),
    };
  }
}
import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

const ISSUER = 'Baghaei Tech Group';

@Injectable()
export class TwoFactorService {
  generateSecret(): string {
    return authenticator.generateSecret();
  }

  /** otpauth:// URI to load into an authenticator app. */
  keyuri(email: string, secret: string): string {
    return authenticator.keyuri(email, ISSUER, secret);
  }

  async qrCodeDataUrl(otpauthUrl: string): Promise<string> {
    return QRCode.toDataURL(otpauthUrl);
  }

  /** Constant-time TOTP check; tolerates clock drift via otplib's window. */
  verify(code: string, secret: string): boolean {
    if (!code || !secret) return false;
    try {
      return authenticator.verify({ token: code.trim(), secret });
    } catch {
      return false;
    }
  }
}

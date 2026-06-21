import { TwoFactorService } from './two-factor.service';
import { authenticator } from 'otplib';

describe('TwoFactorService', () => {
  const service = new TwoFactorService();

  it('verifies a freshly generated TOTP code against its secret', () => {
    const secret = service.generateSecret();
    const token = authenticator.generate(secret);
    expect(service.verify(token, secret)).toBe(true);
  });

  it('returns false when the code or secret is missing', () => {
    expect(service.verify('', 'SOMESECRET')).toBe(false);
    expect(service.verify('123456', '')).toBe(false);
  });

  it('builds an otpauth keyuri with the secret and (url-encoded) account', () => {
    const secret = service.generateSecret();
    const uri = service.keyuri('admin@baghaei.com', secret);
    expect(uri).toContain('otpauth://totp/');
    expect(uri).toContain(`secret=${secret}`);
    expect(uri).toContain('admin%40baghaei.com'); // '@' is url-encoded
  });
});

import { EmailService } from './email.service';

describe('EmailService', () => {
  const original = { ...process.env };

  afterEach(() => {
    process.env = { ...original };
  });

  it('is disabled and no-ops when SMTP env is not configured', async () => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    const service = new EmailService();
    expect(service.enabled).toBe(false);
    await expect(
      service.sendContactNotification({
        name: 'A',
        phone: '123',
        message: 'hi',
      }),
    ).resolves.toBe(false);
  });

  it('is enabled when all SMTP env vars are present', () => {
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user@example.com';
    process.env.SMTP_PASS = 'secret';

    const service = new EmailService();
    expect(service.enabled).toBe(true);
  });
});

import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface ContactPayload {
  name: string;
  phone: string;
  email?: string;
  message: string;
}

/**
 * Transactional email channel — env-gated. With no SMTP_* env vars set it is a
 * no-op (returns false), so the app runs unchanged until credentials are added.
 * Required to activate: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
 * Optional: SMTP_FROM, CONTACT_NOTIFY_EMAIL.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;
  readonly enabled: boolean;

  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    this.enabled = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
    if (this.enabled) {
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
    } else {
      this.logger.warn('SMTP not configured — email notifications disabled.');
    }
  }

  async sendContactNotification(data: ContactPayload): Promise<boolean> {
    if (!this.enabled || !this.transporter) return false;
    const to = process.env.CONTACT_NOTIFY_EMAIL || process.env.SMTP_USER;
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: `پیام جدید از ${data.name}`,
      text:
        `نام: ${data.name}\n` +
        `تلفن: ${data.phone}\n` +
        `ایمیل: ${data.email || 'ندارد'}\n\n` +
        `پیام:\n${data.message}`,
    });
    this.logger.log('Email notification sent.');
    return true;
  }
}

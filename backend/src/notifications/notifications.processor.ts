import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { EmailService } from './email.service';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'contact-message':
        return this.handleContactMessage(job.data);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleContactMessage(data: any) {
    this.logger.log(`Processing contact message from: ${data.name}`);

    // Simulate heavy processing (or actual API call)
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    // Send Telegram Notification
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      try {
        const text = `📬 *پیام جدید در سایت*\n\n👤 نام: ${data.name}\n📱 تلفن: ${data.phone}\n📧 ایمیل: ${data.email || 'ندارد'}\n\n📝 پیام:\n${data.message}`;
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
        });
        this.logger.log('Telegram notification sent successfully.');
      } catch (error) {
        this.logger.error('Failed to send Telegram notification', error);
        // Throwing error causes BullMQ to retry automatically!
        throw error;
      }
    } else {
      this.logger.warn(
        'Telegram credentials not found, skipping notification.',
      );
    }

    // Email channel (env-gated). Non-fatal: a failure here must not discard the
    // message — Telegram already delivered/queued — so we log and continue.
    try {
      await this.emailService.sendContactNotification(data);
    } catch (error) {
      this.logger.error('Failed to send email notification', error);
    }

    return { sent: true };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { TelegramService } from '../notifications/telegram.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService
  ) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const message = await this.prisma.contactMessage.create({
        data: {
          name: createContactDto.name,
          email: createContactDto.email || undefined,
          phone: createContactDto.phone,
          message: createContactDto.message,
        },
      });
      
      this.logger.log(`New contact message received from ${createContactDto.name}`);

      // Send Telegram Notification
      const telegramMsg = `
<b>🚀 درخواست همکاری جدید</b>
<b>نام:</b> ${createContactDto.name}
<b>شماره:</b> ${createContactDto.phone}
<b>ایمیل:</b> ${createContactDto.email || 'ارائه نشده'}
<b>پیام:</b>
${createContactDto.message}
      `;
      await this.telegramService.sendMessage(telegramMsg);

      return { success: true, messageId: message.id };
    } catch (error: any) {
      this.logger.error(`Failed to save contact message: ${error.message}`);
      throw new Error('Could not save the message. Please try again later.');
    }
  }
}
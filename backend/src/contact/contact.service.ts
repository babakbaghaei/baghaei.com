import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { TelegramService } from '../notifications/telegram.service';
import { SecurityService } from '../security/security.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
    private securityService: SecurityService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    try {
      // Sanitize input data

      const sanitizedData = this.securityService.sanitizeInput(
        createContactDto,
      ) as CreateContactDto;

      const message = await this.prisma.contactMessage.create({
        data: {
          name: sanitizedData.name,

          email: sanitizedData.email,

          phone: sanitizedData.phone,

          message: sanitizedData.message,
        },
      });

      this.logger.log(
        `New contact message received from ${sanitizedData.name}`,
      );

      // Send Telegram Notification
      const telegramMsg = `
<b>🚀 درخواست همکاری جدید</b>
<b>نام:</b> ${sanitizedData.name}
<b>شماره:</b> ${sanitizedData.phone}
<b>ایمیل:</b> ${sanitizedData.email || 'ارائه نشده'}
<b>پیام:</b>
${sanitizedData.message}
      `;
      await this.telegramService.sendMessage(telegramMsg);

      return { success: true, messageId: message.id };
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(
        `Failed to save contact message: ${errorMessage}`,
        errorStack,
      );
      throw new InternalServerErrorException(
        `Could not save message: ${errorMessage}`,
      );
    }
  }
}

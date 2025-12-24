import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private prisma: PrismaService) {}

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
      return { success: true, messageId: message.id };
    } catch (error) {
      this.logger.error(`Failed to save contact message: ${error.message}`);
      throw new Error('Could not save the message. Please try again later.');
    }
  }
}
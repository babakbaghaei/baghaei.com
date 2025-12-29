import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private securityService: SecurityService,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const sanitizedData = this.securityService.sanitizeInput(createContactDto);

    // 1. Save to DB (Synchronous - Critical)
    const message = await this.prisma.contactMessage.create({
      data: sanitizedData as any,
    });

    // 2. Offload Notification to Queue (Asynchronous - Non-blocking)
    await this.notificationsQueue.add(
      'contact-message',
      {
        name: message.name,
        email: message.email,
        phone: message.phone,
        message: message.message,
      },
      {
        attempts: 3, // Retry 3 times if fails
        backoff: 5000, // Wait 5s between retries
        removeOnComplete: true,
      },
    );

    return message;
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

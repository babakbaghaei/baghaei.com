import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private prisma: PrismaService,
    private securityService: SecurityService,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async create(createContactDto: CreateContactDto) {
    // Honeypot guard: real users never fill `company` (hidden field). When a
    // bot does, drop the submission but return a success-shaped response so the
    // bot gets no signal that it was detected.
    if (createContactDto.company && createContactDto.company.trim() !== '') {
      this.logger.warn('Honeypot triggered — dropping suspected spam contact.');
      return { id: 0, name: '', isRead: false, createdAt: new Date() };
    }

    // Strip the honeypot before persisting — it is not a ContactMessage column.
    const payload = { ...createContactDto };
    delete payload.company;
    const sanitizedData = this.securityService.sanitizeInput(payload);

    // 1. Save to DB (Synchronous - Critical)
    const message = await this.prisma.contactMessage.create({
      data: sanitizedData,
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

  async countUnread() {
    const count = await this.prisma.contactMessage.count({
      where: { isRead: false },
    });
    return { count };
  }

  async setRead(id: number, isRead: boolean) {
    const existing = await this.prisma.contactMessage.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.contactMessage.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }
    return this.prisma.contactMessage.delete({ where: { id } });
  }
}

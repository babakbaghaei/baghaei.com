import { Injectable, Logger } from '@nestjs/common';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CareersService {
  private readonly logger = new Logger(CareersService.name);

  constructor(
    private prisma: PrismaService,
    private securityService: SecurityService,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async create(dto: CreateJobApplicationDto) {
    // Honeypot guard — mirror ContactService: silently drop, return success shape.
    if (dto.company && dto.company.trim() !== '') {
      this.logger.warn(
        'Honeypot triggered — dropping suspected spam application.',
      );
      return {
        id: 0,
        name: '',
        position: '',
        isRead: false,
        createdAt: new Date(),
      };
    }

    const payload = { ...dto };
    delete payload.company;
    const data = this.securityService.sanitizeInput(payload);

    const application = await this.prisma.jobApplication.create({ data });

    await this.notificationsQueue.add(
      'job-application',
      {
        name: application.name,
        position: application.position,
        email: application.email,
        phone: application.phone,
        portfolioUrl: application.portfolioUrl,
        message: application.message,
      },
      { attempts: 3, backoff: 5000, removeOnComplete: true },
    );

    return application;
  }
}

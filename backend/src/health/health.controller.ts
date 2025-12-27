import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    const dbStatus = await this.checkDatabase();

    return {
      status: dbStatus ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus ? 'up' : 'down',
        api: 'up',
      },
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (e) {
      return false;
    }
  }
}

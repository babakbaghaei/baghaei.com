import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async forceSeed() {
    console.log('🚀 Force Seeding Started...');

    try {
      // 1. Clean up
      await this.prisma.contactMessage.deleteMany({});
      await this.prisma.service.deleteMany({});
      await this.prisma.project.deleteMany({});

      // 2. Create Admin if not exists
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      await this.prisma.user.upsert({
        where: { email: 'admin@baghaei.com' },
        update: {},
        create: {
          email: 'admin@baghaei.com',
          name: 'Babak Baghaei',
          password: hashedAdminPassword,
          role: 'ADMIN',
        },
      });

      // 3. Create Services
      const services = [
        {
          order: 1,
          title: 'تحلیل و مشاوره',
          description:
            'بررسی دقیق نیازها و تدوین نقشه راه تکنولوژی برای پروژه‌های مقیاس‌پذیر.',
          iconName: 'SearchCode',
        },
        {
          order: 2,
          title: 'مهندسی معماری',
          description:
            'طراحی زیرساخت‌های توزیع‌شده با تمرکز بر پایداری حداکثری و ترافیک بالا.',
          iconName: 'Share2',
        },
        {
          order: 3,
          title: 'توسعه محصول',
          description:
            'پیاده‌سازی کدهای بهینه با بالاترین استانداردهای مهندسی نرم‌افزار.',
          iconName: 'Code2',
        },
        {
          order: 4,
          title: 'امنیت و پایش',
          description:
            'تضمین امنیت لایه‌های مختلف داده و پیاده‌سازی پروتکل‌های حفاظتی.',
          iconName: 'ShieldCheck',
        },
        {
          order: 5,
          title: 'استقرار DevOps',
          description:
            'بهره‌گیری از تکنولوژی‌های کانتینر و اتوماسیون برای افزایش سرعت عرضه.',
          iconName: 'Infinity',
        },
        {
          order: 6,
          title: 'نگهداری و رشد',
          description:
            'پایش مداوم عملکرد و ارتقای زیرساخت همگام با رشد تعداد کاربران.',
          iconName: 'TrendingUp',
        },
      ];
      for (const s of services) {
        await this.prisma.service.create({ data: s });
      }

      // 4. Create Projects
      const projects = [
        {
          title: 'سیستم بانکی هوشمند',
          slug: 'smart-banking',
          description: 'معماری میکروسرویس برای تراکنش‌های مالی.',
          published: true,
          tags: 'FinTech',
        },
        {
          title: 'پلتفرم تجارت الکترونیک',
          slug: 'e-commerce',
          description: 'زیرساخت فروشگاهی مقیاس‌پذیر.',
          published: true,
          tags: 'Web',
        },
      ];
      for (const p of projects) {
        await this.prisma.project.create({ data: p });
      }

      return { success: true, message: 'Database populated successfully!' };
    } catch (error: any) {
      console.error('Seed Error:', error);
      return { success: false, message: error.message };
    }
  }

  async getStats() {
    const [projects, services, messages] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.service.count(),
      this.prisma.contactMessage.count(),
    ]);

    return {
      projects,
      services,
      messages,
      careers: 0,
      systemStatus: {
        serverLoad: 12,
        uptime: 99.9,
      },
    };
  }

  async getActivities() {
    const messages = await this.prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
    return messages.map((m) => ({
      id: m.id,
      title: `پیام از ${m.name}`,
      time: m.createdAt,
    }));
  }
}

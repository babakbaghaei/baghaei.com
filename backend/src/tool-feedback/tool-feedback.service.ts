import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ToolFeedbackService {
  private readonly logger = new Logger(ToolFeedbackService.name);

  constructor(
    private prisma: PrismaService,
    private security: SecurityService,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  // ── Public: reviews (comments + rating) ──────────────────────────────────

  async createReview(dto: CreateReviewDto) {
    // Honeypot: silently drop bots but return a success-shaped payload so they
    // get no signal (same pattern as ContactService).
    if (dto.company && dto.company.trim() !== '') {
      this.logger.warn('Honeypot triggered — dropping suspected spam review.');
      return {
        id: 0,
        toolSlug: dto.toolSlug,
        rating: dto.rating,
        createdAt: new Date(),
      };
    }

    const clean = this.security.sanitizeInput({
      toolSlug: dto.toolSlug.trim(),
      name: dto.name?.trim() || null,
      body: dto.body?.trim() || null,
    });
    const rating = Math.min(5, Math.max(1, Math.round(dto.rating)));

    return this.prisma.toolReview.create({
      data: {
        toolSlug: clean.toolSlug,
        name: clean.name,
        body: clean.body,
        rating,
        approved: true,
      },
    });
  }

  async listReviews(toolSlug: string) {
    const slug = this.security.sanitizeInput(toolSlug.trim());
    const reviews = await this.prisma.toolReview.findMany({
      where: { toolSlug: slug, approved: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    const count = reviews.length;
    const average = count
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) /
        10
      : 0;
    return { toolSlug: slug, count, average, reviews };
  }

  // ── Public: report a problem (panel, not email) → Telegram alert ──────────

  async createReport(dto: CreateReportDto) {
    if (dto.company && dto.company.trim() !== '') {
      this.logger.warn('Honeypot triggered — dropping suspected spam report.');
      return { ok: true };
    }

    const clean = this.security.sanitizeInput({
      toolSlug: dto.toolSlug.trim(),
      issue: dto.issue.trim(),
      contact: dto.contact?.trim() || null,
    });

    const report = await this.prisma.toolReport.create({
      data: {
        toolSlug: clean.toolSlug,
        issue: clean.issue,
        contact: clean.contact,
      },
    });

    // Offload the Telegram alert to the shared notifications queue (worker lives
    // in NotificationsProcessor). Non-blocking; retries on failure.
    await this.notificationsQueue.add(
      'tool-report',
      {
        toolSlug: report.toolSlug,
        issue: report.issue,
        contact: report.contact,
      },
      { attempts: 3, backoff: 5000, removeOnComplete: true },
    );

    return { ok: true, id: report.id };
  }

  // ── Admin ─────────────────────────────────────────────────────────────────

  adminListReviews() {
    return this.prisma.toolReview.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async setApproved(id: number, approved: boolean) {
    const existing = await this.prisma.toolReview.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Review ${id} not found`);
    return this.prisma.toolReview.update({ where: { id }, data: { approved } });
  }

  async removeReview(id: number) {
    const existing = await this.prisma.toolReview.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Review ${id} not found`);
    return this.prisma.toolReview.delete({ where: { id } });
  }

  adminListReports() {
    return this.prisma.toolReport.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async setResolved(id: number, resolved: boolean) {
    const existing = await this.prisma.toolReport.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Report ${id} not found`);
    return this.prisma.toolReport.update({ where: { id }, data: { resolved } });
  }

  async removeReport(id: number) {
    const existing = await this.prisma.toolReport.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Report ${id} not found`);
    return this.prisma.toolReport.delete({ where: { id } });
  }
}

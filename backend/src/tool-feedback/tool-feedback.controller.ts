import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { ToolFeedbackService } from './tool-feedback.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('tool-feedback')
@UseInterceptors(TransformInterceptor)
export class ToolFeedbackController {
  constructor(private readonly service: ToolFeedbackService) {}

  // ── Public ──────────────────────────────────────────────────────────────

  // Tighter than the global 100/60s: writing content is spam-prone.
  @Post('reviews')
  @Throttle({ default: { limit: 6, ttl: 60000 } })
  createReview(@Body() dto: CreateReviewDto) {
    return this.service.createReview(dto);
  }

  @Get('reviews/:slug')
  listReviews(@Param('slug') slug: string) {
    return this.service.listReviews(slug);
  }

  @Post('reports')
  @Throttle({ default: { limit: 6, ttl: 60000 } })
  createReport(@Body() dto: CreateReportDto) {
    return this.service.createReport(dto);
  }

  // ── Admin (ADMIN only) ────────────────────────────────────────────────────

  @Get('reviews')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  adminReviews() {
    return this.service.adminListReviews();
  }

  @Patch('reviews/:id/approve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  approve(@Param('id') id: string, @Body() body: { approved: boolean }) {
    return this.service.setApproved(+id, body.approved);
  }

  @Delete('reviews/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  removeReview(@Param('id') id: string) {
    return this.service.removeReview(+id);
  }

  @Get('reports')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  adminReports() {
    return this.service.adminListReports();
  }

  @Patch('reports/:id/resolve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  resolve(@Param('id') id: string, @Body() body: { resolved: boolean }) {
    return this.service.setResolved(+id, body.resolved);
  }

  @Delete('reports/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  removeReport(@Param('id') id: string) {
    return this.service.removeReport(+id);
  }
}

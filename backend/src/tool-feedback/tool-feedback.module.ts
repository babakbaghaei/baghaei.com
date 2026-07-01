import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ToolFeedbackService } from './tool-feedback.service';
import { ToolFeedbackController } from './tool-feedback.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    SecurityModule,
    NotificationsModule,
    // Producer-only: register the queue so InjectQueue works. The worker
    // (NotificationsProcessor) is already provided by ContactModule and handles
    // the new 'tool-report' job — do NOT re-register it here or it double-runs.
    BullModule.registerQueue({ name: 'notifications' }),
  ],
  controllers: [ToolFeedbackController],
  providers: [ToolFeedbackService],
})
export class ToolFeedbackModule {}

import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsProcessor } from '../notifications/notifications.processor';

@Module({
  imports: [
    PrismaModule,
    SecurityModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [ContactController],
  providers: [ContactService, NotificationsProcessor],
})
export class ContactModule {}

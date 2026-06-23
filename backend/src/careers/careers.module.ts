import { Module } from '@nestjs/common';
import { CareersService } from './careers.service';
import { CareersController } from './careers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SecurityModule } from '../security/security.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsProcessor } from '../notifications/notifications.processor';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    SecurityModule,
    NotificationsModule,
    BullModule.registerQueue({ name: 'notifications' }),
  ],
  controllers: [CareersController],
  providers: [CareersService, NotificationsProcessor],
})
export class CareersModule {}

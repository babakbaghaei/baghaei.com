import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [PrismaModule, NotificationsModule, SecurityModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}

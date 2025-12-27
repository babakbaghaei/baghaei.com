import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { SecurityModule } from '../security/security.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [SecurityModule, CacheModule.register()],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}

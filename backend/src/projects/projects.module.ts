import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [
    SecurityModule,
    CacheModule.register({
      ttl: 60000, // 1 minute cache
      max: 100, // Maximum 100 items in cache
    }),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}

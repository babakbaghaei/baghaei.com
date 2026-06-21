import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { LocalDiskStorage } from './local-disk.storage';
import { STORAGE_PROVIDER } from './storage.interface';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    // Swap LocalDiskStorage for an S3/Cloudinary implementation here to change
    // backends without touching the controller or service.
    { provide: STORAGE_PROVIDER, useClass: LocalDiskStorage },
  ],
})
export class UploadModule {}

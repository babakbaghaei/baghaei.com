import { Inject, Injectable } from '@nestjs/common';
import { STORAGE_PROVIDER } from './storage.interface';
import type { StorageProvider, UploadedFileData } from './storage.interface';

@Injectable()
export class UploadService {
  constructor(
    @Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
  ) {}

  async uploadImage(file: UploadedFileData): Promise<{ url: string }> {
    const url = await this.storage.save(file);
    return { url };
  }
}

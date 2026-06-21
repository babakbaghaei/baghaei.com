import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { randomBytes } from 'crypto';
import { StorageProvider, UploadedFileData } from './storage.interface';

/**
 * Stores uploads on the local filesystem under <cwd>/uploads and returns an
 * absolute URL. main.ts serves that directory statically at /uploads. Set
 * APP_PUBLIC_URL to the backend's public origin in production.
 */
@Injectable()
export class LocalDiskStorage implements StorageProvider {
  private readonly logger = new Logger(LocalDiskStorage.name);
  private readonly dir = join(process.cwd(), 'uploads');
  private readonly publicBase = (
    process.env.APP_PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}`
  ).replace(/\/$/, '');

  async save(file: UploadedFileData): Promise<string> {
    await fs.mkdir(this.dir, { recursive: true });
    const ext = (extname(file.originalname) || '').toLowerCase() || '.bin';
    const name = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
    await fs.writeFile(join(this.dir, name), file.buffer);
    this.logger.log(`Stored upload: ${name}`);
    return `${this.publicBase}/uploads/${name}`;
  }
}

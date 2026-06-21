export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

export interface UploadedFileData {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

/**
 * Pluggable storage backend. The default is local disk; swapping to S3 /
 * Cloudinary later means implementing this interface and changing the provider
 * binding in UploadModule — nothing else in the app changes.
 */
export interface StorageProvider {
  save(file: UploadedFileData): Promise<string>; // returns a public URL
}

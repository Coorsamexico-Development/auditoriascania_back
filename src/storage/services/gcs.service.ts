import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { StorageService } from '../interfaces/storage.interfaces';

@Injectable()
export class GcsService implements StorageService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.GCS_BUCKET_NAME ?? '';

    const storageConfig: Record<string, any> = {};

    if (process.env.GCS_PROJECT_ID) {
      storageConfig['projectId'] = process.env.GCS_PROJECT_ID;
    }

    // Solo usar keyFilename en desarrollo local.
    // En Cloud Run las credenciales se obtienen automáticamente via ADC.
    if (process.env.GCS_KEY_FILENAME) {
      storageConfig['keyFilename'] = process.env.GCS_KEY_FILENAME;
    }

    this.storage = new Storage(storageConfig);
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string = '',
    fileName?: string,
  ): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(
      `${path}/${fileName || uuid()}-${file.originalname}`,
    );

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
      highWaterMark: 1024 * 1024, // 1MB
    });

    return new Promise<string>((resolve, reject) => {
      blobStream.on('error', reject);
      blobStream.on('finish', async () => {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }

  async uploadBuffer(
    buffer: Buffer,
    path: string = '',
    options?: {
      fileName?: string;
      contentType?: string;
      extension?: string;
    },
  ) {
    const bucket = this.storage.bucket(this.bucketName);

    // Generar nombre de archivo válido
    const fileExtension = options?.extension || '';
    const fileName = options?.fileName
      ? `${options.fileName}${fileExtension ? `.${fileExtension}` : ''}`
      : `${uuid()}${fileExtension ? `.${fileExtension}` : ''}`;

    const blob = bucket.file(`${path}/${fileName}`);

    // Detectar contentType si no se proporciona
    let contentType = options?.contentType || 'application/octet-stream';

    // Si no se proporciona contentType pero sí extensión, intentar inferirlo
    if (!options?.contentType && fileExtension) {
      const mimeTypes: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        svg: 'image/svg+xml',
        pdf: 'application/pdf',
        json: 'application/json',
        xml: 'application/xml',
        txt: 'text/plain',
        html: 'text/html',
        css: 'text/css',
        js: 'application/javascript',
        zip: 'application/zip',
      };
      contentType = mimeTypes[fileExtension.toLowerCase()] || contentType;
    }

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType,
      highWaterMark: 1024 * 1024, // 1MB
    });

    return new Promise<string>((resolve, reject) => {
      blobStream.on('error', reject);
      blobStream.on('finish', async () => {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(buffer);
    });
  }
}

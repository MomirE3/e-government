import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = parseInt(process.env.MINIO_PORT || '9000', 10);
    const accessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
    const secretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    this.bucketName = process.env.MINIO_BUCKET_NAME || 'e-government-documents';
    this.publicUrl = process.env.MINIO_PUBLIC_URL || `http://localhost:9000`;

    this.minioClient = new Minio.Client({
      endPoint: endpoint,
      port: port,
      useSSL: useSSL,
      accessKey: accessKey,
      secretKey: secretKey,
    });

    this.logger.log(`MinIO client initialized: ${endpoint}:${port}`);
    this.logger.log(`MinIO public URL: ${this.publicUrl}`);
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket "${this.bucketName}" created successfully`);

        // Set bucket policy to allow public read access
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(
          this.bucketName,
          JSON.stringify(policy),
        );
        this.logger.log(`Bucket policy set for "${this.bucketName}"`);
      } else {
        this.logger.log(`Bucket "${this.bucketName}" already exists`);
      }
    } catch (error) {
      this.logger.error('Error ensuring bucket exists:', error);
      throw error;
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'documents',
  ): Promise<string> {
    try {
      const fileName = `${folder}/${Date.now()}-${file.originalname}`;
      const metaData = {
        'Content-Type': file.mimetype,
        'X-Upload-Date': new Date().toISOString(),
      };

      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        metaData,
      );

      this.logger.log(`File uploaded successfully: ${fileName}`);
      return fileName;
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFileUrl(fileName: string): Promise<string> {
    try {
      // Generate a presigned URL valid for 7 days
      const url = await this.minioClient.presignedGetObject(
        this.bucketName,
        fileName,
        24 * 60 * 60 * 7, // 7 days
      );

      this.logger.log(`Generated presigned URL for: ${fileName}`);
      return url;
    } catch (error) {
      this.logger.error('Error getting file URL:', error);
      throw error;
    }
  }

  async getFile(fileName: string): Promise<Buffer> {
    try {
      const dataStream = await this.minioClient.getObject(
        this.bucketName,
        fileName,
      );
      const chunks: Buffer[] = [];

      return new Promise((resolve, reject) => {
        dataStream.on('data', (chunk) => chunks.push(chunk));
        dataStream.on('end', () => resolve(Buffer.concat(chunks)));
        dataStream.on('error', reject);
      });
    } catch (error) {
      this.logger.error('Error getting file:', error);
      throw error;
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, fileName);
      this.logger.log(`File deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      throw error;
    }
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(this.bucketName, fileName);
      return true;
    } catch (error) {
      this.logger.error('Error checking file existence:', error);
      return false;
    }
  }
}

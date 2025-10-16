import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from '../minio/minio.service';
import { DocumentRepository } from './document.repository';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    private readonly minioService: MinioService,
    private readonly documentRepository: DocumentRepository,
  ) {}

  async uploadDocument(
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    file: Buffer | any,
    fileName: string,
    mimeType: string,
  ): Promise<{ fileUrl: string; fileName: string; fileSize: number }> {
    try {
      // Convert to Buffer if it's not already (RPC serialization issue)
      const buffer = Buffer.isBuffer(file)
        ? file
        : Buffer.from(file.data || file);

      const multerFile: Express.Multer.File = {
        buffer: buffer,
        originalname: fileName,
        mimetype: mimeType,
        size: buffer.length,
      } as Express.Multer.File;

      const fileUrl = await this.minioService.uploadFile(
        multerFile,
        'documents',
      );

      this.logger.log(`Document uploaded: ${fileUrl}`);

      return {
        fileUrl,
        fileName,
        fileSize: buffer.length,
      };
    } catch (error) {
      this.logger.error('Error uploading document:', error);
      throw error;
    }
  }

  async getDocumentUrl(fileUrl: string): Promise<string> {
    try {
      return await this.minioService.getFileUrl(fileUrl);
    } catch (error) {
      this.logger.error('Error getting document URL:', error);
      throw error;
    }
  }

  async getDocumentFile(fileUrl: string): Promise<{
    buffer: Buffer;
    fileName: string;
    mimeType: string;
  }> {
    try {
      const buffer = await this.minioService.getFile(fileUrl);

      // Extract filename from fileUrl (e.g., "documents/123-file.pdf" -> "123-file.pdf")
      const fileName = fileUrl.split('/').pop() || 'document';

      // Try to determine MIME type from extension
      const extension = fileName.split('.').pop()?.toLowerCase();
      let mimeType = 'application/octet-stream';

      const mimeTypes: Record<string, string> = {
        pdf: 'application/pdf',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
        webp: 'image/webp',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };

      if (extension && mimeTypes[extension]) {
        mimeType = mimeTypes[extension];
      }

      this.logger.log(`Retrieved document: ${fileUrl}`);

      return {
        buffer,
        fileName,
        mimeType,
      };
    } catch (error) {
      this.logger.error('Error getting document file:', error);
      throw error;
    }
  }

  async deleteDocument(fileUrl: string): Promise<void> {
    try {
      await this.minioService.deleteFile(fileUrl);
      this.logger.log(`Document deleted: ${fileUrl}`);
    } catch (error) {
      this.logger.error('Error deleting document:', error);
      throw error;
    }
  }

  async getDocsIssued(dto: { periodFrom: string; periodTo: string }): Promise<
    Array<{
      periodFrom: string;
      periodTo: string;
      documentType: string;
      count: number;
    }>
  > {
    try {
      const periodFromDate = new Date(dto.periodFrom);
      const periodToDate = new Date(dto.periodTo);

      // Use repository method to get documents statistics
      const result = await this.documentRepository.countByTypeAndPeriod(
        periodFromDate,
        periodToDate,
      );

      this.logger.log(
        `Docs issued statistics: ${result.length} document types found`,
      );

      // Convert Date objects to ISO strings
      return result.map((item) => ({
        periodFrom: item.periodFrom.toISOString(),
        periodTo: item.periodTo.toISOString(),
        documentType: item.documentType,
        count: item.count,
      }));
    } catch (error) {
      this.logger.error('Error getting docs issued statistics:', error);
      throw error;
    }
  }
}

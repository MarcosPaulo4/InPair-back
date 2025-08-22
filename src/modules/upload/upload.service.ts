import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  private s3 = new S3Client({
    region: this.configService.get('BUCKET_REGION'),
    credentials: {
      accessKeyId: this.configService.get('ACCESS_KEY'),
      secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
    },
  });

  async getPressignedUrl(fileType: string) {
    const fileName = crypto.randomBytes(32).toString('hex');

    const command = new PutObjectCommand({
      Bucket: this.configService.get('BUCKET_NAME'),
      Key: `profile-images/${fileName}`,
      ContentType: fileType,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 60 });

    return {
      uploadUrl: url,
      finalUrl: `https://${this.configService.get('BUCKET_NAME')}.s3.${this.configService.get('BUCKET_REGION')}.amazonaws.com/${fileName}`,
    };
  }
}

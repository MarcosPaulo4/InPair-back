import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class UploadService {
  private s3 = new S3Client({
    region: process.env.BUCKER_REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });

  async getPressignedUrl(fileType: string) {
    const fileName = this.randomImageName(32);

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 60 });

    return {
      uploadUrl: url,
      finalUrl: `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`,
    };
  }

  private randomImageName(bytes: number): string {
    const randomString = crypto.randomBytes(bytes).toString('hex');
    return randomString;
  }
}

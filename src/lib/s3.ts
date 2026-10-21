import { S3Client } from "@aws-sdk/client-s3";

export const BUCKET = process.env.S3_BUCKET!;

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true, // если будет ошибка адреса, попробуйте false
});

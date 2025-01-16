import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { createCapability, z } from '@bitlerjs/core';

const s3ListObjectsCapability = createCapability({
  kind: 'aws.s3.list-objects',
  name: 'List S3 Objects',
  group: 'AWS',
  description: 'List objects in an S3 bucket',
  input: z.object({
    awsProfile: z.string().optional(),
    bucket: z.string(),
    prefix: z.string().optional(),
  }),
  output: z.object({
    bucket: z.string(),
    keys: z.array(z.string()),
  }),
  handler: async ({ input }) => {
    const client = new S3Client({
      region: 'eu-west-1',
      profile: input.awsProfile,
    });
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: input.bucket,
        Prefix: input.prefix,
      }),
    );
    const keys = response?.Contents?.flatMap((content) => (content.Key ? [content.Key] : [])) ?? [];
    return { bucket: input.bucket, keys };
  },
});

export { s3ListObjectsCapability };

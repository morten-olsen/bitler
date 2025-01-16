import { createCapability, z } from '@bitlerjs/core';
import { GetObjectCommand, S3Client, S3ServiceException } from '@aws-sdk/client-s3';

const s3GetObjectsCapability = createCapability({
  kind: 'aws.s3.get-objects',
  name: 'Get S3 Objects',
  group: 'AWS',
  description: 'Get objects from an S3 bucket',
  input: z.object({
    awsProfile: z.string().optional(),
    objects: z.array(
      z.object({
        bucket: z.string(),
        key: z.string(),
      }),
    ),
  }),
  output: z.object({
    objects: z.array(
      z.object({
        bucket: z.string(),
        key: z.string(),
        content: z.string(),
      }),
    ),
  }),
  handler: async ({ input }) => {
    const client = new S3Client({
      region: 'eu-west-1',
      profile: input.awsProfile,
    });
    console.log('input', input);
    const objects = await Promise.all(
      input.objects.map(async ({ bucket, key }) => {
        try {
          const response = await client.send(
            new GetObjectCommand({
              Bucket: bucket,
              Key: key,
            }),
          );
          const content = (await response?.Body?.transformToString()) ?? '';
          return {
            bucket,
            key,
            content,
          };
        } catch (e) {
          if (e instanceof S3ServiceException) {
            throw new Error(`Failed to get object from S3: ${e.message}`);
          }
          throw e;
        }
      }),
    );
    return { objects };
  },
});

export { s3GetObjectsCapability };

import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { createCapability, z } from '@bitlerjs/core';

const s3ListBuckets = createCapability({
  kind: 'aws.s3.list-buckets',
  name: 'List S3 Buckets',
  group: 'AWS',
  description: 'List all S3 buckets',
  input: z.object({
    awsProfile: z.string().optional(),
  }),
  output: z.object({
    buckets: z.array(z.string()),
  }),
  handler: async ({ input }) => {
    const client = new S3Client({
      region: 'eu-west-1',
      profile: input.awsProfile,
    });
    const response = await client.send(new ListBucketsCommand({}));
    const buckets = response?.Buckets?.flatMap((bucket) => (bucket.Name ? [bucket.Name] : [])) ?? [];
    return { buckets };
  },
});

export { s3ListBuckets };

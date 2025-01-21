import { createConfigItem, z } from '@bitlerjs/core';

const awsConfig = createConfigItem({
  kind: 'aws.integration',
  name: 'AWS',
  group: 'Integrations',
  description: 'AWS integration',
  schema: z.object({
    enabled: z.boolean(),
    region: z.string().optional(),
    key: z
      .object({
        id: z.string(),
        secret: z.string(),
        session: z.string().optional(),
      })
      .optional(),
    profiles: z.array(z.string()).optional(),
  }),
});

export { awsConfig };

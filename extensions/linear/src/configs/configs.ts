import { createConfigItem, z } from '@bitlerjs/core';
import { LinearClient } from '@linear/sdk';

const linearConfig = createConfigItem({
  kind: 'integration.linear',
  name: 'Linear',
  group: 'Integrations',
  description: 'Linear integration configuration',
  schema: z.object({
    enabled: z.boolean(),
    apiKey: z.string().optional(),
  }),
  validate: async ({ input }) => {
    if (!input.enabled) {
      return;
    }
    const client = new LinearClient({
      apiKey: input.apiKey,
    });
    await client.viewer;
  },
});

export { linearConfig };

import { createConfigItem, z } from '@bitlerjs/core';

const signalConfig = createConfigItem({
  kind: 'signal.integration',
  name: 'Signal',
  group: 'Integrations',
  description: 'Signal integration',
  schema: z.object({
    enabled: z.boolean(),
    apiUrl: z.string(),
  }),
});

export { signalConfig };

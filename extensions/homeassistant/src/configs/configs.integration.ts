import { createConfigItem, z } from '@bitlerjs/core';

const homeAssistantConfig = createConfigItem({
  kind: `homeassistant.integration`,
  name: 'Home Assistant',
  group: 'Integrations',
  description: 'Home Assistant integration',
  schema: z.object({
    enabled: z.boolean(),
    url: z.string(),
    token: z.string(),
  }),
});

export { homeAssistantConfig };

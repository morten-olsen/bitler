import { createConfigItem, z } from '@bitlerjs/core';

const openAIConfig = createConfigItem({
  kind: 'openai',
  name: 'OpenAI',
  group: 'Model Providers',
  description: 'OpenAI configuration',
  schema: z.object({
    apiKey: z.string(),
  }),
});

export { openAIConfig };

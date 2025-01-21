import { createConfigItem, z } from '@bitlerjs/core';

const geminiConfig = createConfigItem({
  kind: 'gemini',
  name: 'Gemini',
  group: 'Model Providers',
  description: 'Gemini configuration',
  schema: z.object({
    apiKey: z.string(),
  }),
});

export { geminiConfig };

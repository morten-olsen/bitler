import { createConfigItem, z } from '@bitlerjs/core';
import OpenAI from 'openai';

const ollamaConfig = createConfigItem({
  kind: 'ollama',
  name: 'Ollama',
  group: 'Model Providers',
  description: 'Ollama configuration',
  schema: z.object({
    url: z.string(),
  }),
  validate: async ({ input }) => {
    const client = new OpenAI({
      baseURL: input.url,
      apiKey: 'ollama',
    });
    await client.models.list();
  },
});

export { ollamaConfig as ollamaConfig };

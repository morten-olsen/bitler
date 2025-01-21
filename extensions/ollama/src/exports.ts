import OpenAI from 'openai';
import { Configs, createExtension } from '@bitlerjs/core';
import { createModel, Models } from '@bitlerjs/llm';

import { ollamaConfig } from './configs/configs.js';

const ollama = createExtension({
  setup: async ({ container }) => {
    const configsService = container.get(Configs);
    const modelsService = container.get(Models);

    configsService.register([ollamaConfig]);

    configsService.use(ollamaConfig, async (config) => {
      if (config) {
        const client = new OpenAI({
          baseURL: config.url,
          apiKey: 'ollama',
        });
        const openAIModels = await client.models.list();
        const models = openAIModels.getPaginatedItems();
        modelsService.register(
          models.map((model) =>
            createModel({
              kind: `ollama-${model.id}`,
              name: model.id,
              modelName: model.id,
              provider: 'ollama',
              apiKey: 'ollama',
              url: config.url,
            }),
          ),
        );
      }
    });
  },
});

export { ollama };

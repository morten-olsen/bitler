import OpenAI from 'openai';
import { Configs, createExtension } from '@bitlerjs/core';
import { createModel, Models } from '@bitlerjs/llm';

import { geminiConfig } from './configs/configs.js';

const gemini = createExtension({
  setup: async ({ container }) => {
    const configsService = container.get(Configs);
    const modelsService = container.get(Models);

    configsService.register([geminiConfig]);

    configsService.use(geminiConfig, async (config) => {
      if (config) {
        const client = new OpenAI({
          baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
          apiKey: config.apiKey,
        });
        const openAIModels = await client.models.list();
        const models = openAIModels.getPaginatedItems();
        modelsService.register(
          models.map((model) =>
            createModel({
              kind: `gemini-${model.id}`,
              name: model.id,
              modelName: model.id,
              provider: 'gemini',
              url: 'https://generativelanguage.googleapis.com/v1beta/openai/',
              apiKey: config.apiKey,
            }),
          ),
        );
      }
    });
  },
});

export { gemini };

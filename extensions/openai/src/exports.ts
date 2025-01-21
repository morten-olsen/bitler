import OpenAI from 'openai';
import { Configs, createExtension } from '@bitlerjs/core';
import { createModel, Models } from '@bitlerjs/llm';

import { openAIConfig } from './configs/configs.js';

const openai = createExtension({
  setup: async ({ container }) => {
    const configsService = container.get(Configs);
    const modelsService = container.get(Models);

    configsService.register([openAIConfig]);

    configsService.use(openAIConfig, async (config) => {
      if (config) {
        const client = new OpenAI({
          apiKey: config.apiKey,
        });
        const openAIModels = await client.models.list();
        const models = openAIModels.getPaginatedItems();
        modelsService.register(
          models.map((model) =>
            createModel({
              kind: `openai-${model.id}`,
              name: model.id,
              modelName: model.id,
              provider: 'openai',
              apiKey: config.apiKey,
            }),
          ),
        );
      }
    });
  },
});

export { openai };

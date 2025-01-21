import { createConfigItem, z } from '@bitlerjs/core';

import { Models } from './models.js';

const modelsConfig = createConfigItem({
  kind: 'models',
  name: 'Models',
  group: 'Models',
  description: 'Models configuration',
  schema: z.object({
    defaultModel: z.string(),
  }),
  validate: async ({ container, input }) => {
    const modelsService = container.get(Models);
    const model = modelsService.get(input.defaultModel);
    if (!model) {
      throw new Error('Model not found');
    }
  },
});

export { modelsConfig };

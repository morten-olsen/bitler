import { createCapability, z } from '@bitlerjs/core';

import { Models } from './models.js';

const listModels = createCapability({
  kind: 'models.list',
  name: 'List',
  group: 'Models',
  description: 'List all models',
  disableDiscovery: false,
  input: z.object({}),
  output: z.object({
    models: z.array(
      z.object({
        kind: z.string(),
        name: z.string(),
        provider: z.string(),
      }),
    ),
  }),
  handler: async ({ container }) => {
    const modelsService = container.get(Models);
    const models = modelsService.list();
    return { models };
  },
});

export { listModels };

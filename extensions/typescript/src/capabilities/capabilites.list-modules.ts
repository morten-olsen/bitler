import { createCapability, z } from '@bitlerjs/core';

import { TypeScriptService } from '../services/services.typescript.js';

const listTypescriptModules = createCapability({
  kind: 'typescript.list-modules',
  name: 'List modules',
  group: 'TypeScript',
  description: 'List TypeScript modules',
  input: z.object({}),
  output: z.object({
    modules: z.array(z.string()),
  }),
  handler: async ({ container }) => {
    const typescriptService = container.get(TypeScriptService);
    const modules = typescriptService.listModules();
    return { modules };
  },
});

export { listTypescriptModules };

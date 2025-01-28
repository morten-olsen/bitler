import { createCapability, z } from '@bitlerjs/core';

import { TypeScriptService } from '../services/services.typescript.js';

const addTypescriptModule = createCapability({
  kind: 'typescript.add-module',
  name: 'Add module',
  group: 'TypeScript',
  description: 'Add a TypeScript module',
  input: z.object({
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    code: z.string(),
    allowModules: z.array(z.string()),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ container, input }) => {
    const typescriptService = container.get(TypeScriptService);
    typescriptService.registerModules({
      [input.id]: () => {
        const { result } = typescriptService.execute({
          code: input.code,
          allowModules: input.allowModules,
        });
        return result;
      },
    });
    return {
      success: true,
    };
  },
});

export { addTypescriptModule };

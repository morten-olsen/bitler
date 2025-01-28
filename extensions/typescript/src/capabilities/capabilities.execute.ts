import { createCapability, z } from '@bitlerjs/core';

import { TypeScriptService } from '../services/services.typescript.js';

const executeTypeScript = createCapability({
  kind: 'typescript.execute',
  name: 'Execute',
  group: 'TypeScript',
  description: 'Execute TypeScript code',
  input: z.object({
    code: z.string(),
    allowModules: z.array(z.string()).optional(),
  }),
  output: z.object({
    result: z.unknown(),
  }),
  handler: async ({ input, container }) => {
    const typescriptService = container.get(TypeScriptService);
    return typescriptService.execute(input);
  },
});

export { executeTypeScript };

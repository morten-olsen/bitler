import { createContextItem, createContextSetup, z } from '@bitlerjs/core';

import { LinearService } from '../servies/services.linear.js';

const userContext = createContextItem({
  kind: 'linear.user',
  name: 'Linear User',
  description: 'The current linear user',
  schema: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

const userContextSetup = createContextSetup({
  handler: async ({ container, context }) => {
    const linearService = container.get(LinearService);
    const api = await linearService.getApi();
    const user = await api.viewer;
    context.set(userContext, {
      id: user.id,
      name: user.name,
    });
  },
});

export { userContext, userContextSetup };

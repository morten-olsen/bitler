import { createContextItem, createContextSetup, z } from '@bitler/core';

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
    const { getUser } = container.get(LinearService);
    const userInfo = await getUser();
    context.set(userContext, {
      id: userInfo.id,
      name: userInfo.name,
    });
  },
});

export { userContext, userContextSetup };

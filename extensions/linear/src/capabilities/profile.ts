import { createCapability, z } from '@bitlerjs/core';

import { LinearService } from '../servies/services.linear.js';

const profile = createCapability({
  kind: 'linear.profile',
  name: 'Get my profile',
  group: 'Linear',
  description: 'Get the Linear profile of the current user',
  input: z.object({}),
  output: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  handler: async ({ container }) => {
    const { getUser } = container.get(LinearService);
    const user = await getUser();
    return user;
  },
});

export { profile };

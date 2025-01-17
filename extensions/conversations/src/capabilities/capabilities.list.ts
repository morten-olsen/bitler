import { createCapability, z } from '@bitlerjs/core';

import { Conversations } from '../services/conversations/conversations.js';

const listConversationsCapability = createCapability({
  kind: 'conversations.list',
  name: 'List',
  group: 'Conversations',
  description: 'Get a list of all conversations',
  disableDiscovery: true,
  input: z.object({}),
  output: z.object({
    conversations: z.array(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    ),
  }),
  handler: async ({ container }) => {
    const conversationsService = container.get(Conversations);
    const conversations = await conversationsService.list();
    return { conversations };
  },
});

export { listConversationsCapability };

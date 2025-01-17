import { createCapability, z } from '@bitlerjs/core';

import { conversationStateSchema } from '../schemas/schemas.js';
import { Conversations } from '../services/conversations/conversations.js';

const syncConversationCapability = createCapability({
  kind: 'conversations.sync',
  name: 'Details and history',
  group: 'Conversations',
  description: 'Get all information about a conversation',
  disableDiscovery: true,
  input: z.object({
    conversationId: z.string(),
  }),
  output: conversationStateSchema,
  handler: async ({ input, container }) => {
    const conversationsService = container.get(Conversations);
    const conversation = await conversationsService.get(input.conversationId);
    return conversation.state;
  },
});

export { syncConversationCapability };

import { createCapability, z } from '@bitlerjs/core';

import { Conversations } from '../services/conversations/conversations.js';

const removeMessagesCapability = createCapability({
  kind: 'conversations.remove-messages',
  name: 'Remove messages',
  group: 'Conversations',
  description: 'Remove messages from a conversation',
  disableDiscovery: true,
  input: z.object({
    conversationId: z.string(),
    messageIds: z.array(z.string()),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, container }) => {
    const conversationsService = container.get(Conversations);
    const conversation = await conversationsService.get(input.conversationId);
    await conversation.removeMessages(input.messageIds);
    return { success: true };
  },
});

export { removeMessagesCapability };

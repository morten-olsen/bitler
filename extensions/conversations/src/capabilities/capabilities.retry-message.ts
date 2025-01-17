import { createCapability, z } from '@bitlerjs/core';
import { completionResultSchema } from '@bitlerjs/llm';

import { Conversations } from '../services/conversations/conversations.js';

const retryMessageCapability = createCapability({
  kind: 'conversations.retry-message',
  name: 'Retry message',
  group: 'Conversations',
  description: 'Remove all messages after a certain message and retry the conversation',
  disableDiscovery: true,
  input: z.object({
    conversationId: z.string(),
    messageId: z.string(),
  }),
  output: completionResultSchema,
  handler: async ({ input, container, session }) => {
    const conversationsService = container.get(Conversations);
    const conversation = await conversationsService.get(input.conversationId);
    const result = await conversation.retryMessage(input.messageId, session);
    return result;
  },
});

export { retryMessageCapability };

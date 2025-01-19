import { createCapability, z } from '@bitlerjs/core';
import { completionOptionsSchema, completionResultSchema } from '@bitlerjs/llm';

import { Conversations } from '../services/conversations/conversations.js';

const promptCapability = createCapability({
  kind: 'conversations.prompt',
  name: 'Prompt',
  group: 'Conversations',
  description: 'Process a prompt',
  disableDiscovery: true,
  input: z.object({
    conversationId: z.string(),
    ...completionOptionsSchema.shape,
  }),
  output: completionResultSchema,
  handler: async ({ input, container, session }) => {
    const { conversationId, ...options } = input;
    const conversationsService = container.get(Conversations);
    const conversation = await conversationsService.get(conversationId);
    const combinedOptions = completionOptionsSchema.parse({
      ...conversation.state,
      ...options,
    });
    const messages = options.dialog || conversation.state.messages;
    const result = await conversation.complete({
      ...combinedOptions,
      ...options,
      dialog: messages,
      session,
    });
    return result;
  },
});

export { promptCapability };

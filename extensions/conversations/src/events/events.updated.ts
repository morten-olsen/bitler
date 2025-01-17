import { createEvent, z } from '@bitlerjs/core';

import { conversationStateSchema } from '../schemas/schemas.js';
import { Conversations } from '../services/conversations/conversations.js';

const conversationSyncSchema = z.object({
  type: z.literal('sync'),
  payload: conversationStateSchema,
});

const conversationDeltaSchema = z.object({
  type: z.literal('delta'),
  payload: z.object({
    conversationId: z.string(),
    delta: z.any(),
    hash: z.object({
      from: z.string(),
      to: z.string(),
    }),
  }),
});

const conversationSubscriptionEvent = createEvent({
  kind: 'conversations.updated',
  name: 'Subscription update',
  group: 'Conversations',
  description: 'Event that is emitted when a conversation is updated',
  input: z.object({
    ids: z.array(z.string()).optional(),
  }),
  output: z.union([conversationSyncSchema, conversationDeltaSchema]),
  filter: async ({ input, event }) => {
    if (input.ids && !input.ids.includes(event.payload.conversationId)) {
      return false;
    }
    return true;
  },
  setup: async ({ container, input, listener }) => {
    if (!input.ids) {
      return;
    }
    const conversationsService = container.get(Conversations);
    for (const id of input.ids) {
      const conversation = await conversationsService.get(id);
      listener({
        type: 'sync',
        payload: conversation.state,
      });
    }
  },
});

export { conversationSubscriptionEvent, conversationSyncSchema, conversationDeltaSchema };

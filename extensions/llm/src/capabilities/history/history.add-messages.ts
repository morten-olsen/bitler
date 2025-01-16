import { Databases, createCapability, createId, z } from '@bitlerjs/core';

import { dbConfig } from '../../databases/databases.history.js';

const historyAddMessagesCapability = createCapability({
  kind: 'history.add-messages',
  name: 'Add messages',
  group: 'History',
  description: 'Add messages to a conversation',
  input: z.array(
    z.object({
      conversationId: z.string(),
      role: z.string(),
      content: z.string(),
    }),
  ),
  output: z.object({
    ids: z.array(z.string()),
    success: z.boolean(),
  }),
  handler: async ({ container, input }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);

    const mapped = input.map((message) => ({
      id: createId(),
      conversationId: message.conversationId,
      role: message.role,
      content: message.content,
      createdAt: new Date(),
    }));

    if (!input.length) {
      return { success: true, ids: [] };
    }
    await db('messages').insert(mapped);

    return { success: true, ids: mapped.map((m) => m.id) };
  },
});

export { historyAddMessagesCapability };

import { Databases, createCapability, z } from '@bitler/core';

import { dbConfig } from '../../databases/databases.history.js';

const historyListCapability = createCapability({
  kind: 'history.list',
  name: 'List conversations',
  group: 'History',
  description: 'List all conversations',
  input: z.object({
    limit: z.number().optional(),
  }),
  output: z.object({
    conversations: z.array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        pinned: z.boolean(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    ),
  }),
  handler: async ({ container, input }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);

    let query = db('conversations')
      .select(['id', 'name', 'description', 'pinned', 'createdAt', 'updatedAt'])
      .orderBy('updatedAt', 'desc');

    if (input.limit) {
      query = query.limit(input.limit);
    }

    const conversations = await query;

    return { conversations };
  },
});

export { historyListCapability };

import { Databases, createCapability, z } from '@bitlerjs/core';

import { dbConfig } from '../../databases/databases.history.js';

const historyDeleteMessagesCapability = createCapability({
  kind: 'history.delete-messages',
  name: 'Delete messages',
  group: 'History',
  description: 'Delete messages',
  input: z.object({
    ids: z.array(z.string()),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ container, input }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);

    await db.transaction(async (trx) => {
      await trx('messages').whereIn('id', input.ids).delete();
    });
    return { success: true };
  },
});

export { historyDeleteMessagesCapability };

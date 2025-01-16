import { Databases, Events, createCapability, z } from '@bitlerjs/core';

import { dbConfig } from '../../databases/databases.history.js';
import { historyUpdatedEvent } from '../../events/history/history.updated.js';

const historyDeleteCapability = createCapability({
  kind: 'history.delete',
  group: 'History',
  name: 'Delete conversation',
  description: 'Delete a conversation',
  input: z.object({
    id: z.string(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ container, input }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);

    await db.transaction(async (trx) => {
      await trx('conversations').where('id', input.id).delete();
    });

    const events = container.get(Events);
    events.publish(historyUpdatedEvent, {
      id: input.id,
    });

    return { success: true };
  },
});

export { historyDeleteCapability };

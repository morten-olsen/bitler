import { Databases, Events, createCapability, z } from '@bitlerjs/core';

import { dbConfig } from '../databases/databases.js';
import { notificationRemovedEvent } from '../events/events.removed.js';

const removeNotificationsCapability = createCapability({
  kind: 'notification.remove',
  name: 'Remove',
  group: 'Notification',
  description: 'Remove a notification',
  input: z.object({
    ids: z.array(z.string()),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, container }) => {
    const dbs = container.get(Databases);
    const eventsService = container.get(Events);
    const db = await dbs.get(dbConfig);

    await db.transaction(async (trx) => {
      await trx('notifications').whereIn('id', input.ids).delete();
    });

    input.ids.forEach((id) => {
      eventsService.publish(notificationRemovedEvent, { id });
    });

    return { success: true };
  },
});

export { removeNotificationsCapability };

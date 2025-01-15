import { Databases, Events, createCapability, createId, z } from '@bitler/core';

import { dbConfig } from '../databases/databases.js';
import { notificationCreatedEvent } from '../events/events.created.js';

const addNotificationCapability = createCapability({
  kind: 'notification.add',
  name: 'Add',
  group: 'Notification',
  description: 'Add a notification',
  input: z.object({
    id: z.string().optional(),
    title: z.string(),
    message: z.string(),
    actions: z
      .array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          kind: z.string().describe('The kind of capability to run'),
          removeNotification: z.boolean().optional(),
          data: z.any().describe('The input to the capability'),
        }),
      )
      .optional(),
  }),
  output: z.object({
    id: z.string(),
  }),
  handler: async ({ input, container }) => {
    const dbs = container.get(Databases);
    const eventsService = container.get(Events);
    const db = await dbs.get(dbConfig);
    const id = input.id || createId();
    const actions = input.actions?.map((action) => ({
      id: createId(),
      title: action.title,
      description: action.description,
      kind: action.kind,
      removeNotification: action.removeNotification || false,
      data: action.data,
    }));

    await db.transaction(async (trx) => {
      await trx('notifications')
        .insert({
          id,
          title: input.title,
          message: input.message,
        })
        .onConflict('id')
        .merge();

      await trx('notificationActions').where('notificationId', id).delete();

      if (actions) {
        await trx('notificationActions').insert(actions);
      }
    });

    eventsService.publish(notificationCreatedEvent, {
      id,
      title: input.title,
      message: input.message,
      actions: actions || [],
    });

    return { id };
  },
});

export { addNotificationCapability };

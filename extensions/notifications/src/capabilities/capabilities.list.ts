import { Databases, createCapability, z } from '@bitlerjs/core';

import { dbConfig } from '../databases/databases.js';

const listNotificationCapability = createCapability({
  kind: 'notification.list',
  name: 'List',
  group: 'Notification',
  description: 'List notifications',
  input: z.object({}),
  output: z.object({
    notifications: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        message: z.string(),
        createdAt: z.string(),
        actions: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string().optional(),
            kind: z.string(),
            removeNotification: z.boolean().optional(),
            data: z.any(),
          }),
        ),
      }),
    ),
  }),
  handler: async ({ container }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);

    const notifications = await db('notifications').select('*');
    const actions = await db('notificationActions').select('*');

    const result = notifications.map((notification) => ({
      ...notification,
      actions: actions.filter((action) => action.notificationId === notification.id),
    }));

    return { notifications: result };
  },
});

export { listNotificationCapability };

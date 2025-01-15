import { Capabilities, Databases, createCapability, z } from '@bitlerjs/core';

import { dbConfig } from '../databases/databases.js';

const runNotificationActionCapability = createCapability({
  kind: 'notification.run-action',
  name: 'Run Action',
  group: 'Notification',
  description: 'Run a notification action',
  input: z.object({
    actionId: z.string(),
  }),
  output: z.object({
    actionId: z.string(),
    notificationId: z.string(),
    success: z.boolean(),
  }),
  handler: async ({ input, container, session }) => {
    const dbs = container.get(Databases);
    const db = await dbs.get(dbConfig);

    const [action] = await db('notificationActions').select('*').where('id', input.actionId).limit(1);
    if (!action) {
      throw new Error('Action not found');
    }
    const capabilitiesService = container.get(Capabilities);
    const [capability] = capabilitiesService.get([action.kind]);
    if (!capability) {
      throw new Error('Capability not found');
    }
    await capabilitiesService.run({
      capability,
      input: action.data,
      session,
    });

    if (action.removeNotification) {
      await db('notifications').where('id', action.notificationId).delete();
    }

    return {
      success: true,
      actionId: action.id,
      notificationId: action.notificationId,
    };
  },
});

export { runNotificationActionCapability };

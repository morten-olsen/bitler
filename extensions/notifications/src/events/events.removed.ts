import { createEvent, z } from '@bitler/core';

const notificationRemovedEvent = createEvent({
  kind: 'notification.removed',
  group: 'Notification',
  name: 'Notification Removed',
  description: 'A notification was removed',
  input: z.object({
    ids: z.array(z.string()).optional(),
  }),
  output: z.object({
    id: z.string(),
  }),
  filter: async ({ input, event }) => {
    return input.ids?.includes(event.id) || false;
  },
});

export { notificationRemovedEvent };

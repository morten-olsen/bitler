import { createEvent, z } from '@bitlerjs/core';

const notificationCreatedEvent = createEvent({
  kind: 'notification.created',
  group: 'Notification',
  name: 'Created',
  description: 'A notification was created',
  input: z.object({}),
  output: z.object({
    id: z.string(),
    title: z.string(),
    message: z.string(),
    actions: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
      }),
    ),
  }),
});

export { notificationCreatedEvent };

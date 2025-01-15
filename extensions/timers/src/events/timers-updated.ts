import { createEvent, z } from '@bitlerjs/core';

const timerUpdatedEvent = createEvent({
  kind: 'timer.updated',
  name: 'Timer Updated',
  group: 'Timer',
  description: 'A timer was updated',
  input: z.object({}),
  output: z.object({
    id: z.string(),
    description: z.string().optional(),
    duration: z.number(),
    action: z.union([z.literal('created'), z.literal('updated'), z.literal('removed')]),
  }),
});

export { timerUpdatedEvent };

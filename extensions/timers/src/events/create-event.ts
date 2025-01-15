import { createEvent, z } from '@bitlerjs/core';

const timerCreatedEvent = createEvent({
  kind: 'timer.created',
  name: 'Timer Created',
  group: 'Timer',
  description: 'A timer was created',
  input: z.object({}),
  output: z.object({
    id: z.string(),
    description: z.string().optional(),
    duration: z.number(),
  }),
});

export { timerCreatedEvent };

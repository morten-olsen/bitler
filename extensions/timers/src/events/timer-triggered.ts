import { createEvent, z } from '@bitlerjs/core';

const timerTriggeredEvent = createEvent({
  kind: 'timer.triggered',
  name: 'Timer Triggered',
  group: 'Timer',
  description: 'A timer has been triggered',
  input: z.object({}),
  output: z.object({
    id: z.string(),
    description: z.string().optional(),
    duration: z.number(),
  }),
});

export { timerTriggeredEvent };

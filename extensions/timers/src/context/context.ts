import { createContextItem, createContextSetup, z } from '@bitler/core';

const currentTimeContext = createContextItem({
  kind: `timers.current-time`,
  name: 'Current Time',
  description: 'The current time',
  schema: z.string(),
});

const currentTimeContextSetup = createContextSetup({
  handler: async ({ context }) => {
    context.set(currentTimeContext, new Date().toISOString());
  },
});

export { currentTimeContext, currentTimeContextSetup };

import { createCapability, currentTimeContextSetup, z } from '@bitlerjs/core';

import { TimerService, timerSchema } from '../service/service.js';

const listTimers = createCapability({
  kind: 'timers.list',
  name: 'List Timers',
  group: 'Timers',
  description: 'List all timers',
  setup: [currentTimeContextSetup],
  input: z.object({}),
  output: z.object({
    timers: z.array(timerSchema),
  }),
  handler: async ({ container }) => {
    const service = container.get(TimerService);
    const result = await service.listTimers();
    return { timers: result };
  },
});

export { listTimers };

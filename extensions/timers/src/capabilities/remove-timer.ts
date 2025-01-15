import { createCapability, z } from '@bitlerjs/core';

import { TimerService } from '../service/service.js';
import { currentTimeContextSetup } from '../context/context.js';

const removeTimer = createCapability({
  kind: 'timers.remove',
  name: 'Remove Timer',
  group: 'Timers',
  description: 'Remove a timer by ID',
  setup: [currentTimeContextSetup],
  input: z.object({
    id: z.string().describe('ID of the timer'),
  }),
  output: z.object({
    success: z.boolean().describe('True if the timer was removed'),
  }),
  handler: async ({ container, input }) => {
    const service = container.get(TimerService);
    const timer = service.get(input.id);
    await service.removeTimer(input.id);
    return { success: true };
  },
});

export { removeTimer };

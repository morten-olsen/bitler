import { createCapability, z } from '@bitler/core';

import { TimerService, addTimerSchema } from '../service/service.js';
import { currentTimeContextSetup } from '../context/context.js';

const addTimer = createCapability({
  kind: 'timers.add',
  name: 'Add Timer',
  group: 'Timers',
  description: 'Add a timer',
  input: addTimerSchema,
  setup: [currentTimeContextSetup],
  output: z.object({
    id: z.string().describe('ID of the timer'),
  }),
  handler: async ({ container, input }) => {
    const service = container.get(TimerService);
    const result = await service.addTimer(input);
    return result;
  },
});

export { addTimer };

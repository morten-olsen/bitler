import { Capabilities, ContextItems, Events, createExtension } from '@bitlerjs/core';
import { Agents } from '@bitlerjs/llm';

import { timerAgent } from './agents/agents.main.js';
import { addTimer } from './capabilities/add-timer.js';
import { removeTimer } from './capabilities/remove-timer.js';
import { listTimers } from './capabilities/list-timers.js';
import { TimerService } from './service/service.js';
import { timerCreatedEvent } from './events/create-event.js';
import { timerTriggeredEvent } from './events/timer-triggered.js';
import { timerUpdatedEvent } from './events/timers-updated.js';

const timers = createExtension({
  setup: async ({ container }) => {
    const service = container.get(TimerService);
    await service.start();

    const agentsService = container.get(Agents);
    agentsService.register([timerAgent]);

    const eventsService = container.get(Events);
    eventsService.register([timerCreatedEvent, timerTriggeredEvent, timerUpdatedEvent]);

    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([addTimer, removeTimer, listTimers]);
  },
});

export { timers };

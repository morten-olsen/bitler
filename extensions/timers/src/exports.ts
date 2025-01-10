import { createExtension } from "@bitler/core";
import { timerAgent } from "./agents/agents.main.js";
import { addTimer } from "./capabilities/add-timer.js";
import { removeTimer } from "./capabilities/remove-timer.js";
import { listTimers } from "./capabilities/list-timers.js";
import { currentTimeContext } from "./context/context.js";
import { TimerService } from "./service/service.js";
import { timerCreatedEvent } from "./events/create-event.js";
import { timerTriggeredEvent } from "./events/timer-triggered.js";
import { timerUpdatedEvent } from "./events/timers-updated.js";

const timers = createExtension({
  setup: async ({ container }) => {
    const service = container.get(TimerService);
    await service.start();
  },
  events: [
    timerCreatedEvent,
    timerTriggeredEvent,
    timerUpdatedEvent,
  ],
  contexts: [
    currentTimeContext,
  ],
  agents: [
    timerAgent,
  ],
  capabilities: [
    addTimer,
    removeTimer,
    listTimers,
  ]
})

export { timers };

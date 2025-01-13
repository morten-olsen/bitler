import { createAgent } from "@bitler/llm";
import { addTimer } from "../capabilities/add-timer.js";
import { listTimers } from "../capabilities/list-timers.js";
import { removeTimer } from "../capabilities/remove-timer.js";

const timerAgent = createAgent({
  kind: 'timers',
  name: 'Timers',
  description: 'An agent for timers (count down alarms)',
  systemPrompt: 'Your task is to manage timers - use to provided tools to add, remove, and list timers.',
  capabilities: [
    addTimer.kind,
    listTimers.kind,
    removeTimer.kind,
  ],
})

export { timerAgent };

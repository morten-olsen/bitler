import { Capabilities, ContextItems, createExtension } from '@bitlerjs/core';
import { Agents } from '@bitlerjs/llm';

import { capabilities } from './capabilities/capabilities.js';
import { roomsContext } from './context/rooms.js';
import { agent } from './agent/agent.js';
import { agentConfig } from './agent/agent.config.js';

const homeassistant = createExtension({
  setup: async ({ container }) => {
    const agentsService = container.get(Agents);
    agentsService.register([agent, agentConfig]);

    const contextItemsService = container.get(ContextItems);
    contextItemsService.register([roomsContext]);

    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([...Object.values(capabilities.lights), ...Object.values(capabilities.config)]);
  },
});

export { HomeassistantService } from './services/services.ha.js';
export { roomsContextSetup, HomeAssistantContext } from './context/rooms.js';
export { homeassistant, capabilities, roomsContext };

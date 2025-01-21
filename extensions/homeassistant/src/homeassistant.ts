import { Capabilities, Configs, ContextItems, createExtension } from '@bitlerjs/core';
import { Agents } from '@bitlerjs/llm';

import { capabilities, setupCapbility } from './capabilities/capabilities.js';
import { roomsContext } from './context/rooms.js';
import { agent } from './agent/agent.js';
import { agentConfig } from './agent/agent.config.js';
import { homeAssistantConfig } from './configs/configs.integration.js';
import { HomeassistantService } from './homeassistant.js';

const homeassistant = createExtension({
  setup: async ({ container }) => {
    const configsService = container.get(Configs);
    const agentsService = container.get(Agents);
    const contextItemsService = container.get(ContextItems);
    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([setupCapbility]);
    configsService.register([homeAssistantConfig]);

    configsService.use(homeAssistantConfig, async (config) => {
      if (!config || !config.enabled) {
        agentsService.unregister([agent.kind, agentConfig.kind]);
        contextItemsService.unregister([roomsContext.kind]);
        capabilitiesService.unregister([
          ...Object.values(capabilities.lights).map((c) => c.kind),
          ...Object.values(capabilities.config).map((c) => c.kind),
        ]);
        if (container.has(HomeassistantService)) {
          container.remove(HomeassistantService);
        }
      } else {
        agentsService.register([agent, agentConfig]);
        contextItemsService.register([roomsContext]);
        capabilitiesService.register([...Object.values(capabilities.lights), ...Object.values(capabilities.config)]);
      }
    });
  },
});

export { HomeassistantService } from './services/services.ha.js';
export { roomsContextSetup, HomeAssistantContext } from './context/rooms.js';
export { homeassistant, capabilities, roomsContext, homeAssistantConfig };

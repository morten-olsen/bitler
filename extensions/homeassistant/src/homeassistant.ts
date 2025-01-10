import { createExtension } from "@bitler/core";
import { capabilities } from "./capabilities/capabilities.js";
import { agent } from "./agent/agent.js";
import { roomsContext } from "./context/rooms.js";
import { agentConfig } from "./agent/agent.config.js";

const homeassistant = createExtension({
  contexts: [
    roomsContext,
  ],
  agents: [
    agent,
    agentConfig,
  ],
  capabilities: [
    ...Object.values(capabilities.lights),
    ...Object.values(capabilities.config),
  ],
})

export { HomeassistantService } from './services/services.ha.js';
export { roomsContextSetup, HomeAssistantContext } from './context/rooms.js';
export { homeassistant, capabilities, roomsContext };

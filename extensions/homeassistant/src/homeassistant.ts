import { createExtension } from "@bitler/core";
import { capabilities } from "./capabilities/capabilities.js";
import { roomsContext } from "./context/rooms.js";

const homeassistant = createExtension({
  contexts: [
    roomsContext,
  ],
  capabilities: [
    ...Object.values(capabilities.lights),
    ...Object.values(capabilities.config),
  ],
})

export { HomeassistantService } from './services/services.ha.js';
export { roomsContextSetup, HomeAssistantContext } from './context/rooms.js';
export { homeassistant, capabilities, roomsContext };

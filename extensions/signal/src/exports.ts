import { createExtension } from "@bitler/core";
import { SignalService } from "./services/services.signal.js";
import { getContactsCapability } from "./capabilities/get-contacts.js";
import { getGroupsCapability } from "./capabilities/get-groups.js";
import { sendCapability } from "./capabilities/send.js";
import { agent } from "./agents/agent.js";

const signal = createExtension({
  setup: async ({ container }) => {
    const signalService = container.get(SignalService);
    await signalService.setup();
  },
  agents: [
    agent,
  ],
  capabilities: [
    getContactsCapability,
    getGroupsCapability,
    sendCapability,
  ]
});

export { signal, getContactsCapability, getGroupsCapability };

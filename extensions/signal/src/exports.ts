import { Capabilities, createExtension } from "@bitler/core";
import { SignalService } from "./services/services.signal.js";
import { getContactsCapability } from "./capabilities/get-contacts.js";
import { getGroupsCapability } from "./capabilities/get-groups.js";
import { sendCapability } from "./capabilities/send.js";

const signal = createExtension({
  setup: async ({ container }) => {
    const signalService = container.get(SignalService);
    await signalService.setup();

    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([
      getContactsCapability,
      getGroupsCapability,
      sendCapability,
    ]);

  },
});

export { signal, getContactsCapability, getGroupsCapability };

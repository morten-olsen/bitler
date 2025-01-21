import { Capabilities, createExtension, Configs } from '@bitlerjs/core';

import { SignalService } from './services/services.signal.js';
import { getContactsCapability } from './capabilities/get-contacts.js';
import { getGroupsCapability } from './capabilities/get-groups.js';
import { sendCapability } from './capabilities/send.js';
import { signalConfig } from './configs/configs.js';

const signal = createExtension({
  setup: async ({ container }) => {
    const configsService = container.get(Configs);
    const capabilitiesService = container.get(Capabilities);

    configsService.register([signalConfig]);

    configsService.use(signalConfig, async (config) => {
      if (!config || !config.enabled) {
        if (container.has(SignalService)) {
          const signalService = container.get(SignalService);
          await signalService.destroy();
          container.remove(SignalService);
        }
        capabilitiesService.unregister([getContactsCapability.kind, getGroupsCapability.kind, sendCapability.kind]);
      } else {
        const signalService = container.get(SignalService);
        await signalService.setup();
        capabilitiesService.register([getContactsCapability, getGroupsCapability, sendCapability]);
      }
    });
  },
});

export { signal, getContactsCapability, getGroupsCapability };

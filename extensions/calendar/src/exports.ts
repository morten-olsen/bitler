import { Capabilities, Configs, createExtension } from '@bitlerjs/core';

import { calendarConfig } from './configs/configs.js';
import { getEventsCapability } from './capabilities/capabilites.get-events.js';

const calendars = createExtension({
  setup: async ({ container }) => {
    const configsService = container.get(Configs);
    configsService.register([calendarConfig]);

    const capabilitesService = container.get(Capabilities);
    capabilitesService.register([getEventsCapability]);
  },
});

export { calendars };

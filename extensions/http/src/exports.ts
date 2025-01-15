import { Capabilities, createExtension } from '@bitlerjs/core';

import { fetchHttpCapability } from './capabilities/capabilities.fetch.js';

const http = createExtension({
  setup: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([fetchHttpCapability]);
  },
});

export { http, fetchHttpCapability };

import { Capabilities, createExtension } from '@bitlerjs/core';

import { executeTypeScript } from './capabilities/capabilities.execute.js';
import { addTypescriptModule } from './capabilities/capabilites.add-module.js';
import { listTypescriptModules } from './capabilities/capabilites.list-modules.js';

const typescript = createExtension({
  setup: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([executeTypeScript, addTypescriptModule, listTypescriptModules]);
  },
});

export { typescript };

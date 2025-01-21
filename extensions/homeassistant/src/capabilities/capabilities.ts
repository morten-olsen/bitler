import { Configs, createCapability, z } from '@bitlerjs/core';

import { homeAssistantConfig } from '../homeassistant.js';

import { config } from './config/config.js';
import { lights } from './lights/lights.js';

const setupCapbility = createCapability({
  kind: 'homeassistant.setup',
  name: 'Setup Home Assistant',
  group: 'Integrations',
  description: 'Setup Home Assistant',
  input: z.object({
    url: z.string(),
    token: z.string(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ container, input }) => {
    const configsService = container.get(Configs);
    await configsService.setValue(homeAssistantConfig, {
      enabled: true,
      url: input.url,
      token: input.token,
    });
    return { success: true };
  },
});

const capabilities = {
  lights,
  config,
};

export { capabilities, setupCapbility };

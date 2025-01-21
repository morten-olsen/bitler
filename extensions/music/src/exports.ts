import { Capabilities, Configs, createExtension } from '@bitlerjs/core';
import { Agents } from '@bitlerjs/llm';
import { homeAssistantConfig } from '@bitlerjs/homeassistant';

import { search } from './capabilities/search.js';
import { agent } from './agents/agent.js';
import { play } from './capabilities/play.js';
import { setVolume } from './capabilities/set-volume.js';
import { pause } from './capabilities/pause.js';
import { status } from './capabilities/status.js';
import { previous } from './capabilities/previous.js';
import { next } from './capabilities/next.js';
import { resume } from './capabilities/resume.js';
import { spotifyConfig } from './configs/configs.js';

const music = createExtension({
  setup: async ({ container }) => {
    const configsService = container.get(Configs);
    const capabilitiesService = container.get(Capabilities);
    const agentsService = container.get(Agents);

    configsService.register([homeAssistantConfig, spotifyConfig]);

    await configsService.use(spotifyConfig, async (config) => {
      if (!config) {
        capabilitiesService.unregister([search.kind]);
      } else {
        capabilitiesService.register([search]);
      }
    });

    await configsService.use(homeAssistantConfig, async (config) => {
      if (!config || !config.enabled) {
        capabilitiesService.unregister([
          play.kind,
          pause.kind,
          setVolume.kind,
          status.kind,
          previous.kind,
          next.kind,
          resume.kind,
        ]);

        agentsService.unregister([agent.kind]);
      } else {
        capabilitiesService.register([play, pause, setVolume, status, previous, next, resume]);

        agentsService.register([agent]);
      }
    });
  },
});

export { music };

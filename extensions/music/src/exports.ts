import { Capabilities, createExtension } from '@bitlerjs/core';
import { Agents } from '@bitlerjs/llm';

import { search } from './capabilities/search.js';
import { agent } from './agents/agent.js';
import { play } from './capabilities/play.js';
import { setVolume } from './capabilities/set-volume.js';
import { pause } from './capabilities/pause.js';
import { status } from './capabilities/status.js';
import { previous } from './capabilities/previous.js';
import { next } from './capabilities/next.js';
import { resume } from './capabilities/resume.js';

const music = createExtension({
  setup: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([search, play, pause, setVolume, status, previous, next, resume]);

    const agentsService = container.get(Agents);
    agentsService.register([agent]);
  },
});

export { music };

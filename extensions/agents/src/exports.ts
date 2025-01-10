import { createExtension } from '@bitler/core';
import { list } from './capabilities/list.js';
import { listAll } from './capabilities/list-all.js';
import { set } from './capabilities/set.js';
import { listCapabilities } from './capabilities/list-capabilities.js';
import { agent } from './agents/agent.js';
import { CustomAgents } from './services/services.agents.js';
import { remove } from './capabilities/remove.js';

const agents = createExtension({
  setup: async ({ container }) => {
    const customAgentsService = container.get(CustomAgents);
    await customAgentsService.setup();
  },
  agents: [
    agent,
  ],
  capabilities: [
    list,
    listAll,
    listCapabilities,
    set,
    remove,
  ]
});

export { agents };

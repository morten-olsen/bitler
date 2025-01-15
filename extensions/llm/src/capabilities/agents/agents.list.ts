import { createCapability, z } from '@bitler/core';

import { Agents } from '../../services/agents/agents.js';

const agentsList = createCapability({
  kind: 'agents.list',
  name: 'List Agents',
  group: 'Agents',
  description: 'List all the agents that the exists in the system',
  input: z.object({}),
  output: z.object({
    agents: z.array(
      z.object({
        kind: z.string(),
        name: z.string(),
        group: z.string().optional(),
        description: z.string().optional(),
      }),
    ),
  }),
  handler: async ({ container }) => {
    const agentsService = container.get(Agents);
    const agents = agentsService.list();
    return { agents };
  },
});

export { agentsList };

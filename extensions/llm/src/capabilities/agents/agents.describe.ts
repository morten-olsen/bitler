import { createCapability, z } from '@bitlerjs/core';

import { agentSchema } from '../../services/agents/agents.schemas.js';
import { Agents } from '../../services/agents/agents.js';

const describeAgent = createCapability({
  kind: 'agents.describe',
  name: 'Describe',
  group: 'Agents',
  description: 'Get details about an agent',
  input: z.object({
    kind: z.string(),
  }),
  output: agentSchema,
  handler: async ({ input, container }) => {
    const agentsService = container.get(Agents);
    const [agent] = agentsService.get([input.kind]);
    if (!agent) {
      throw new Error('Agent not found');
    }
    return agent;
  },
});

export { describeAgent };

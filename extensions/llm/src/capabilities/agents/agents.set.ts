import { createCapability, z } from '@bitlerjs/core';

import { agentSchema } from '../../services/agents/agents.schemas.js';
import { Agents } from '../../services/agents/agents.js';

const setAgent = createCapability({
  kind: 'agents.set',
  name: 'Set',
  group: 'Agents',
  description: 'Create or update a custom agent',
  input: agentSchema,
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, container }) => {
    const agentsService = container.get(Agents);
    await agentsService.setCustomAgent(input);
    return { success: true };
  },
});

export { setAgent };

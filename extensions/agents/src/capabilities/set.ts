import { agentSchema, createCapability, z } from "@bitler/core";
import { CustomAgents } from "../services/services.agents.js";

const set = createCapability({
  kind: 'custom-agents.set',
  name: 'Set',
  group: 'Custom Agents',
  description: 'Create or update a custom agent based on its kind',
  input: agentSchema,
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, container }) => {
    const service = container.get(CustomAgents);
    await service.set(input);

    return {
      success: true,
    }
  },
})

export { set }

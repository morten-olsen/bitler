import { createCapability, z } from "@bitler/core";
import { CustomAgents } from "../services/services.agents.js";

const remove = createCapability({
  kind: 'custom-agents.remove',
  name: 'Set',
  group: 'Custom Agents',
  description: 'Create or update a custom agent based on its kind',
  input: z.object({
    kinds: z.array(z.string()),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, container }) => {
    const service = container.get(CustomAgents);
    await service.remove(input.kinds);

    return {
      success: true,
    }
  },
})

export { remove }

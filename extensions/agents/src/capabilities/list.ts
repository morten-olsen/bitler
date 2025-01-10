import { agentSchema, createCapability, z } from "@bitler/core";
import { CustomAgents } from "../services/services.agents.js";

const list = createCapability({
  kind: 'custom-agents.list',
  name: 'List Custom',
  group: 'Custom Agents',
  description: ' Get a list of custom (editable) agents',
  input: z.object({}),
  output: z.object({
    agents: z.array(agentSchema)
  }),
  handler: async ({ container }) => {
    const service = container.get(CustomAgents);
    const agents = service.customAgents;

    return {
      agents,
    }
  },
})

export { list }

import { Agents, agentSchema, createCapability, z } from "@bitler/core";

const listAll = createCapability({
  kind: 'custom-agents.list',
  name: 'List All',
  group: 'Custom Agents',
  description: ' Get a list of all agents, including built-in and custom (editable) agents',
  input: z.object({}),
  output: z.object({
    agents: z.array(agentSchema)
  }),
  handler: async ({ container }) => {
    const service = container.get(Agents);
    const agents = service.list();

    return {
      agents,
    }
  },
})

export { listAll }

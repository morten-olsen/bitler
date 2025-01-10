import { Capabilities, createCapability, z } from "@bitler/core";

const listCapabilities = createCapability({
  kind: 'custom-agents.capabilities',
  name: 'List Capabilities',
  group: 'Custom Agents',
  description: 'Get a list of available capabilities',
  input: z.object({}),
  output: z.object({
    capabilities: z.array(z.object({
      kind: z.string(),
      name: z.string(),
      group: z.string(),
      description: z.string().optional(),
    }))
  }),
  handler: async ({ container }) => {
    const service = container.get(Capabilities);
    const capabilities = service.list();

    return {
      capabilities,
    }
  },
})

export { listCapabilities }

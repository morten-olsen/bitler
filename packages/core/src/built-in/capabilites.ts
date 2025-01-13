import { z } from "zod";
import { Capabilities, createCapability } from "../capabilities/capabilities.js";

const listCapabilities = createCapability({
  kind: 'capabilities.list',
  name: 'List Capabilities',
  group: 'Built-in',
  description: 'List all the capabilities that the exists in the system',
  input: z.object({}),
  output: z.object({
    capabilities: z.array(z.object({
      kind: z.string(),
      name: z.string(),
      group: z.string(),
      description: z.string(),
    })),
  }),
  handler: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);
    const capabilities = capabilitiesService.list();
    return {
      capabilities,
    };
  },
});


export { listCapabilities };

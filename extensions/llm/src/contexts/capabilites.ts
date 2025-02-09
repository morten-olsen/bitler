import { Capabilities, createContextItem, createContextSetup, z } from '@bitlerjs/core';

const capabilitiesContext = createContextItem({
  kind: 'builtin.capabilities',
  name: 'Capabilities',
  description: 'The capabilities that the system has',
  schema: z.array(
    z.object({
      kind: z.string(),
      name: z.string(),
      group: z.string(),
      description: z.string(),
    }),
  ),
});

const capabilitiesContextSetup = createContextSetup({
  handler: async ({ container, context }) => {
    const capabilitiesService = container.get(Capabilities);
    const capabilities = capabilitiesService.list();
    context.set(capabilitiesContext, capabilities);
  },
});

export { capabilitiesContext, capabilitiesContextSetup };

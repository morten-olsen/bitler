import { z } from "zod";
import { Capabilities, createCapability } from "../capabilities/capabilities.js";
import { Agents } from "../agents/agents.js";
import { addCapabilitiesRequest, createDialog, createDialogOptionsSchema } from "./action-requests.js";
import { capabilitiesContextSetup } from "./contexts.js";
import { agentSession, Completion, completionOptionsSchema } from "../exports.js";

const listAgents = createCapability({
  kind: 'builtin.list-agents',
  name: 'List Agents',
  group: 'Built-in',
  description: 'List all the agents that the exists in the system',
  input: z.object({}),
  output: z.object({
    agents: z.array(z.object({
      kind: z.string(),
      name: z.string(),
      group: z.string().optional(),
      description: z.string().optional(),
    })),
  }),
  handler: async ({ container }) => {
    const agentsService = container.get(Agents);
    const agents = agentsService.list();
    return { agents };
  },
})

const listCapabilities = createCapability({
  kind: 'builtin.list-capabilities',
  name: 'List Capabilities',
  group: 'Built-in',
  description: 'List all the capabilities that the exists in the system',
  input: z.object({}),
  output: z.object({
    included: z.array(z.object({
      kind: z.string(),
      name: z.string(),
      group: z.string(),
      description: z.string(),
    })),
    all: z.array(z.object({
      kind: z.string(),
      name: z.string(),
      group: z.string(),
      description: z.string(),
    })),
  }),
  handler: async ({ container, session }) => {
    const capabilitiesService = container.get(Capabilities);
    const all = capabilitiesService.list();
    const includedStr = session.get(agentSession)?.capabilities || [];
    const included = capabilitiesService.get(includedStr).flatMap((capability) => capability ? [capability] : []);
    return {
      all,
      included,
    };
  },
});

const createNewDialog = createCapability({
  kind: 'builtin.create-new-dialog',
  name: 'Create New Dialog',
  group: 'Built-in',
  setup: [
    capabilitiesContextSetup,
  ],
  description: 'Create a new dialog',
  input: createDialogOptionsSchema,
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, actionRequests }) => {
    actionRequests.request(createDialog, input);
    return { success: true };
  },
});

const addCapabilities = createCapability({
  kind: 'builtin.add-capabilities',
  name: 'Add capabilities',
  group: 'Built-in',
  setup: [
    capabilitiesContextSetup,
  ],
  description: 'Add capabilities to the current conversation',
  input: z.object({
    capabilities: z.array(z.string()).describe('The capabilities to add to the conversation (kind). These will become available the next time the user makes a request.'),
  }),
  output: z.object({
    success: z.boolean(),
  }),
  handler: async ({ input, actionRequests }) => {
    actionRequests.request(addCapabilitiesRequest, input.capabilities);
    return { success: true };
  },
});

const prompt = createCapability({
  kind: 'builtin.prompt',
  name: 'Prompt',
  group: 'Built-in',
  description: 'Send a prompt to the LLM',
  input: completionOptionsSchema,
  output: z.object({
    response: z.string(),
    context: z.record(z.unknown()),
    actionRequests: z.array(z.object({
      kind: z.string(),
      description: z.string().optional(),
      value: z.unknown(),
    })),

  }),
  handler: async ({ input, container }) => {
    const completionService = container.get(Completion);
    const result = await completionService.complete(input);
    return result;
  },
});

export { listCapabilities, listAgents, createNewDialog, addCapabilities, prompt };

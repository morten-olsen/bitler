import { z } from "zod";
import { createCapability } from "../capabilities/capabilities.js";
import { ActionRequests, getJsonSchema } from "../exports.js";

const listActionRequestsCapability = createCapability({
  kind: 'action-requests.list',
  name: 'List',
  group: 'Action Requests',
  description: 'List all the action request types that the exists in the system',
  input: z.object({}),
  output: z.object({
    actionRequests: z.array(z.object({
      kind: z.string(),
      name: z.string(),
      description: z.string(),
    })),
  }),
  handler: async ({ container }) => {
    const actionRequestService = container.get(ActionRequests);
    const actionRequests = actionRequestService.list();
    return {
      actionRequests,
    }
  },
});

const describeActionRequestsCapability = createCapability({
  kind: 'action-requests.describe',
  name: 'Details',
  group: 'Action Requests',
  description: 'Describe an action request',
  input: z.object({
    kind: z.string(),
  }),
  output: z.object({
    actionRequest: z.object({
      kind: z.string(),
      name: z.string(),
      description: z.string(),
      schema: z.any(),
    }),
  }),
  handler: async ({ container, input }) => {
    const actionRequestService = container.get(ActionRequests);
    const actionRequest = actionRequestService.get(input.kind);
    if (!actionRequest) {
      throw new Error(`Action Request ${input.kind} not found`);
    }
    return {
      actionRequest: {
        ...actionRequest,
        schema: getJsonSchema(actionRequest.schema),
      },
    }
  },
});

export { listActionRequestsCapability, describeActionRequestsCapability };


import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { Capabilities, ContextItems, z } from '../../exports.js';
import { ActionRequests } from '../../action-requests/action-requests.js';
import { getJsonSchema } from '../../utils/zod.js';
import { Events } from '../../events/events.js';

const schemasSchema = z.object({
  capabilities: z.record(
    z.object({
      kind: z.string(),
      group: z.string(),
      name: z.string(),
      description: z.string(),
      input: z.any(),
      output: z.any(),
    }),
  ),
  actionRequests: z.record(
    z.object({
      kind: z.string(),
      name: z.string(),
      description: z.string(),
      schema: z.any(),
    }),
  ),
  contextItems: z.record(
    z.object({
      kind: z.string(),
      name: z.string(),
      description: z.string(),
      schema: z.any(),
    }),
  ),
  events: z.record(
    z.object({
      kind: z.string(),
      name: z.string(),
      description: z.string(),
      input: z.any(),
      output: z.any(),
    }),
  ),
});
const schemasPlugin: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: 'get',
    url: '',
    schema: {
      tags: ['schemas'],
      operationId: 'schemas.list',
      response: {
        200: schemasSchema,
      },
    },
    handler: async (request, reply) => {
      const { container } = request;
      const capabilitesService = container.get(Capabilities);
      const actionRequestsService = container.get(ActionRequests);
      const contextItemsService = container.get(ContextItems);
      const eventsService = container.get(Events);

      const capabilities = capabilitesService.list();
      const actionRequests = actionRequestsService.list();
      const contextItems = contextItemsService.list();
      const events = eventsService.list();

      const result = {
        capabilities: Object.fromEntries(
          capabilities.map((capability) => [
            capability.kind,
            {
              kind: capability.kind,
              group: capability.group,
              name: capability.name,
              description: capability.description,
              input: getJsonSchema(capability.input),
              output: getJsonSchema(capability.output),
            },
          ]),
        ),
        actionRequests: Object.fromEntries(
          actionRequests.map((actionRequest) => [
            actionRequest.kind,
            {
              kind: actionRequest.kind,
              name: actionRequest.name,
              description: actionRequest.description,
              schema: getJsonSchema(actionRequest.schema),
            },
          ]),
        ),
        contextItems: Object.fromEntries(
          contextItems.map((contextItem) => [
            contextItem.kind,
            {
              kind: contextItem.kind,
              name: contextItem.name,
              description: contextItem.description,
              schema: getJsonSchema(contextItem.schema),
            },
          ]),
        ),
        events: Object.fromEntries(
          events.map((event) => [
            event.kind,
            {
              kind: event.kind,
              name: event.name,
              description: event.description,
              input: getJsonSchema(event.input),
              output: getJsonSchema(event.output),
            },
          ]),
        ),
      };
      reply.send(result);
    },
  });
};

export { schemasPlugin };

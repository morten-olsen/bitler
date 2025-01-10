import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod";
import { Agents } from "../../agents/agents.js";
import { Completion, completionOptionsSchema } from "../../exports.js";

const agentsPlugin: FastifyPluginAsyncZod = async (app) => {
  app.route({
    url: '/list',
    method: 'get',
    schema: {
      operationId: 'agents.list',
      summary: 'Get list of available agents',
      tags: ['agents'],
      response: {
        200: z.array(z.object({
          kind: z.string(),
          name: z.string(),
          group: z.string().optional(),
          description: z.string().optional(),
        }))
      },
    },
    handler: async (request, reply) => {
      const agentsService = request.container.get(Agents);
      const agents = agentsService.list();
      await reply.send(agents.map((agent) => ({
        kind: agent.kind,
        group: agent.group,
        name: agent.name,
        description: agent.description,
      })));
    },
  });

  app.route({
    url: '/prompt',
    method: 'post',
    schema: {
      operationId: 'agents.prompt',
      summary: 'Prompt an agent',
      tags: ['agents'],
      body: completionOptionsSchema,
      response: {
        200: z.object({
          response: z.string(),
          context: z.record(z.unknown()),
          actionRequests: z.array(z.object({
            kind: z.string(),
            description: z.string().optional(),
            value: z.unknown(),
          })),
        }),
      },
    },
    handler: async (request, reply) => {

      try {
        const completionService = request.container.get(Completion);
        const result = await completionService.complete(request.body);

        await reply.send(result);
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
  });
};

export { agentsPlugin };

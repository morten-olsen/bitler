import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { Models } from "../../models/models.js";

const modelsPlugin: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: 'get',
    url: '/list',
    schema: {
      operationId: 'models.list',
      summary: 'Get list of available models',
      tags: ['models'],
      response: {
        200: z.array(z.object({
          id: z.string(),
          name: z.string(),
        }))
      },
    },
    handler: async (request, reply) => {
      const models = request.container.get(Models);
      const result = models.models;
      reply.send(result);
    }
  });
};

export { modelsPlugin };

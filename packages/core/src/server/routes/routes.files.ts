import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from 'zod';
import { Files } from '../../files/files.js';

const filesPlugin: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: 'get',
    url: '/:hash',
    schema: {
      operationId: 'capabilities.list',
      summary: 'Get list of available tasks',
      tags: ['capabilities'],
      params: z.object({
        hash: z.string(),
      }),
    },
    handler: async (request, reply) => {
      const filesService = request.container.get(Files);
      const file = await filesService.get(request.params.hash);
      reply.type(file.contentType);
      reply.send(file.content);
    }
  });
};

export { filesPlugin };

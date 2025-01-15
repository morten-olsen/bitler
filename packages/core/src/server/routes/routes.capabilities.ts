import { httpErrors } from '@fastify/sensible';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { Capabilities } from '../../capabilities/capabilities.js';
import { Session } from '../../exports.js';

const capabilitiesPlugin: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: 'get',
    url: '/list',
    schema: {
      operationId: 'capabilities.list',
      summary: 'Get list of available tasks',
      tags: ['capabilities'],
      response: {
        200: z.array(
          z.object({
            kind: z.string(),
            name: z.string(),
            group: z.string(),
            description: z.string().optional(),
          }),
        ),
      },
    },
    handler: async (request, reply) => {
      const capabilitiesService = request.container.get(Capabilities);
      const capabilities = capabilitiesService.list();
      await reply.send(
        capabilities.map((capability) => ({
          kind: capability.kind,
          name: capability.name,
          group: capability.group,
          description: capability.description,
        })),
      );
    },
  });

  app.route({
    method: 'post',
    url: '/run',
    schema: {
      operationId: 'capabilities.run',
      summary: 'Run a cpaability',
      tags: ['capabilities'],
      body: z.object({
        kind: z.string(),
        input: z.any(),
      }),
      response: {
        200: z.any(),
      },
    },
    handler: async (request, reply) => {
      const { kind, input } = request.body;
      const capabilitiesService = request.container.get(Capabilities);
      const [capability] = capabilitiesService.get([kind]);
      const session = new Session();
      if (!capability) {
        return httpErrors.notFound('Capability not found');
      }
      const params = capability.input.parse(input);
      try {
        const result = await capabilitiesService.run({
          capability,
          input: params,
          session,
        });
        await reply.send(result);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
};

export { capabilitiesPlugin };

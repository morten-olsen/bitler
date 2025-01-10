import { httpErrors } from '@fastify/sensible';
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
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
      tags: ['capabilites'],
      response: {
        200: z.array(z.object({
          kind: z.string(),
          name: z.string(),
          group: z.string(),
          description: z.string().optional(),
        }))
      },
    },
    handler: async (request, reply) => {
      const capabilitiesService = request.container.get(Capabilities);
      const capabilities = capabilitiesService.list();
      await reply.send(capabilities.map((capability) => ({
        kind: capability.kind,
        name: capability.name,
        group: capability.group,
        description: capability.description,
      })));
    }
  });

  app.route({
    method: 'get',
    url: '/describe/:kind',
    schema: {
      operationId: 'tasks.describe',
      summary: 'Get task schema',
      tags: ['tasks'],
      params: z.object({
        kind: z.string(),
      }),
      response: {
        200: z.object({
          kind: z.string(),
          name: z.string(),
          group: z.string(),
          description: z.string().optional(),
          input: z.any(),
          output: z.any(),
        })
      },
    },
    handler: async (request, reply) => {
      const { kind } = request.params;
      const capabilitiesService = request.container.get(Capabilities);
      const [capability] = capabilitiesService.get([kind]);
      if (!capability) {
        throw httpErrors.notFound();
      }
      await reply.send({
        ...capability,
      });
    }
  });

  app.route({
    method: 'post',
    url: '/search',
    schema: {
      operationId: 'tasks.search',
      summary: 'Search for tasks',
      tags: ['tasks'],
      body: z.object({
        query: z.string(),
        limit: z.number().optional(),
      }),
      response: {
        200: z.array(z.object({
          kind: z.string(),
          name: z.string(),
          group: z.string(),
          description: z.string().optional(),
          similarity: z.number(),
        }))
      },
    },
    handler: async (request, reply) => {
      const { query, limit } = request.body;
      const capabilitiesService = request.container.get(Capabilities);

      const result = await capabilitiesService.find(query, limit);
      await reply.send(result.map(({ similarity, capability }) => ({
        kind: capability.kind,
        name: capability.name,
        group: capability.group,
        description: capability.description,
        similarity,
      })));
    },
  })

  app.route({
    method: 'post',
    url: '/run',
    schema: {
      operationId: 'tasks.run',
      summary: 'Run a task',
      tags: ['tasks'],
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
        return httpErrors.notFound('Capabbility not found');
      }
      const params = capability.input.parse(input);
      const result = await capabilitiesService.run({
        capability,
        input: params,
        session,
      });
      await reply.send(result);
    },
  })
};

export { capabilitiesPlugin };

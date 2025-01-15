import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { Event, Events } from "../../events/events.js";
import { httpErrors } from "@fastify/sensible";

const eventsPlugin: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: 'post',
    url: '/subscribe',
    schema: {
      tags: ['events'],
      operationId: 'events.subscribe',
      body: z.object({
        kind: z.string(),
        input: z.any(),
      }),
    },
    handler: async (request, reply) => {
      const eventsService = request.container.get(Events);
      const { kind, input } = request.body;
      const event = eventsService.get(kind);

      if (!event) {
        throw httpErrors.notFound('Event not found');
      }
      const parsedInput = event.input.parse(input);
      reply.hijack();
      reply.raw.setHeaders(new Map([
        ["Content-Type", "application/octet-stream"],
        ["Cache-Control", "no-cache"]
      ]));

      const send = (response: unknown) => {
        reply.raw.write(`${JSON.stringify(response)}\n`);
      };

      const handler = async (emittedEvent: Event<any, any>, value: unknown) => {
        if (emittedEvent.kind !== event.kind) {
          return;
        }
        if (event.filter && !(await event.filter({
          container: request.container,
          input: parsedInput,
          event: value,
        }))) {
          return;
        }
        send(value);
      }


      eventsService.on('emitted', handler);
      reply.raw.on("close", () => {
        eventsService.off('emitted', handler);
      });
    },
  });
};

export { eventsPlugin }

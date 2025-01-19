import { httpErrors } from '@fastify/sensible';
import fastifyWebsocket from '@fastify/websocket';
import { Events, z } from '@bitlerjs/core';
import { WebSocketClient } from '../websocket/websocket.client.js';
const eventsPlugin = async (app) => {
    await app.register(fastifyWebsocket);
    app.get('/ws', { websocket: true }, (socket, req) => {
        new WebSocketClient({
            socket,
            container: req.container,
        });
    });
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
                ['Content-Type', 'application/octet-stream'],
                ['Cache-Control', 'no-cache'],
                // CORS headers
                ['Access-Control-Allow-Origin', '*'],
                ['Access-Control-Allow-Methods', 'POST'],
                ['Access-Control-Allow-Headers', 'Content-Type'],
            ]));
            const send = (response) => {
                reply.raw.write(`${JSON.stringify(response)}\n`);
            };
            const handler = async (emittedEvent, value) => {
                if (emittedEvent.kind !== event.kind) {
                    return;
                }
                if (event.filter &&
                    !(await event.filter({
                        container: request.container,
                        input: parsedInput,
                        event: value,
                    }))) {
                    return;
                }
                send(value);
            };
            eventsService.on('emitted', handler);
            await event.setup?.({
                container: request.container,
                input: parsedInput,
                listener: async (value) => {
                    send(value);
                },
            });
            reply.raw.on('close', () => {
                eventsService.off('emitted', handler);
            });
        },
    });
};
export { eventsPlugin };
//# sourceMappingURL=routes.events.js.map
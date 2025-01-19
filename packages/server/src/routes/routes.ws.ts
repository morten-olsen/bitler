import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import fastifyWebsocket from '@fastify/websocket';

import { WebSocketClient } from '../websocket/websocket.client.js';
import { AuthOptions } from '../server.js';

type Options = {
  auth?: (options: AuthOptions) => Promise<void>;
};

const wsPlugin: FastifyPluginAsyncZod<Options> = async (app, options) => {
  await app.register(fastifyWebsocket);

  app.get('/api/ws', { websocket: true }, (socket, req) => {
    new WebSocketClient({
      socket,
      container: req.container,
      auth: options.auth,
    });
  });
};

export { wsPlugin };

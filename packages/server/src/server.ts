import fastify, { FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { ZodTypeProvider, jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { Container, Session } from '@bitlerjs/core';
import { httpErrors } from '@fastify/sensible';

import { capabilitiesPlugin } from './routes/routes.capabilities.js';
import { schemasPlugin } from './routes/routes.schema.js';
import { wsPlugin } from './routes/routes.ws.js';
import { filesPlugin } from './routes/routes.files.js';

type AuthOptions = {
  session: Session;
  container: Container;
  request: FastifyRequest;
};

type SetupOptions = {
  app: fastify.FastifyInstance;
  container: Container;
};

type CreateOptions = {
  setup?: (options: SetupOptions) => Promise<void>;
  auth?: (options: AuthOptions) => Promise<void>;
};
class Server {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  public create = async ({ setup, auth }: CreateOptions = {}) => {
    const app = fastify().withTypeProvider<ZodTypeProvider>();
    await app.register(cors);
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.decorate('container', this.#container);

    await app.register(swagger, {
      openapi: {
        info: {
          title: 'Bitler API',
          version: '0.1.0',
        },
        servers: [
          {
            url: 'http://localhost:3000',
            description: 'Development server',
          },
        ],
      },
      transform: jsonSchemaTransform,
    });
    await app.register(swaggerUi, {
      routePrefix: '/api/docs',
    });
    app.addHook('onRequest', async (request) => {
      request.container = this.#container;
      request.session = new Session();
    });
    await app.register(wsPlugin, { auth });

    await app.register(async (app) => {
      app.addHook('onRequest', async (request) => {
        try {
          await auth?.({
            session: request.session,
            container: this.#container,
            request,
          });
        } catch (error) {
          request.log.error(error);
          throw httpErrors.unauthorized('Unauthorized');
        }
      });

      await app.register(capabilitiesPlugin, { prefix: '/api/capabilities' });
      await app.register(schemasPlugin, { prefix: '/api/schemas' });
      await app.register(filesPlugin, { prefix: '/api/files' });
    });

    if (setup) {
      await setup({
        app,
        container: this.#container,
      });
    }

    await app.ready();
    app.swagger();
    return app;
  };
}

export { Server, type AuthOptions };

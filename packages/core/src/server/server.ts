import fastify from "fastify";
import cors from '@fastify/cors';
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { Container } from "../container/container.js";
import { capabilitiesPlugin } from "./routes/routes.capabilities.js";
import { schemasPlugin } from "./routes/routes.schema.js";
import { eventsPlugin } from "./routes/routes.events.js";
import { builtIn, Extension, Extensions } from "../exports.js";
import { resolve } from "path";
import fastifyStatic from "@fastify/static";
import { filesPlugin } from "./routes/routes.files.js";

type CreateOptions = {
  setup?: (app: fastify.FastifyInstance) => Promise<void>;
}
class Server {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  public create = async ({ setup }: CreateOptions = {}) => {
    const app = fastify().withTypeProvider<ZodTypeProvider>();
    await app.register(cors);
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.decorate('container', this.#container);
    app.addHook('onRequest', async (request) => {
      request.container = this.#container;
    });

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

    await app.register(capabilitiesPlugin, { prefix: '/api/capabilities' });
    await app.register(schemasPlugin, { prefix: '/api/schemas' });
    await app.register(eventsPlugin, { prefix: '/api/events' });
    await app.register(filesPlugin, { prefix: '/api/files' });

    if (setup) {
      await setup(app);
    }

    await app.ready();
    app.swagger();
    return app;
  }
}

type Configuration = {
  extensions?: Extension[];
  container?: Container;
}

const setupServer = async ({
  extensions = [],
  container = new Container(),
}: Configuration) => {

  const extensionsService = container.get(Extensions);
  await extensionsService.register([
    builtIn,
    ...extensions
  ]);
  const server = container.get(Server);
  const app = await server.create({
    setup: async (app) => {
      const root = resolve('./dist/frontend');
      await app.register(fastifyStatic, {
        root,
        wildcard: false,
      });
    },
  });

  await app.listen({
    port: 3000,
    host: process.env.HOST,
  })
}

export { Server, setupServer, type Configuration };

import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { capabilitiesPlugin } from './routes/routes.capabilities.js';
import { schemasPlugin } from './routes/routes.schema.js';
import { eventsPlugin } from './routes/routes.events.js';
import { filesPlugin } from './routes/routes.files.js';
class Server {
    #container;
    constructor(container) {
        this.#container = container;
    }
    create = async ({ setup } = {}) => {
        const app = fastify().withTypeProvider();
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
export { Server };
//# sourceMappingURL=server.js.map
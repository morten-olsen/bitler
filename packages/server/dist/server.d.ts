import fastify from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { Container } from '@bitlerjs/core';
type SetupOptions = {
    app: fastify.FastifyInstance;
    container: Container;
};
type CreateOptions = {
    setup?: (options: SetupOptions) => Promise<void>;
};
declare class Server {
    #private;
    constructor(container: Container);
    create: ({ setup }?: CreateOptions) => Promise<fastify.FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, fastify.FastifyBaseLogger, ZodTypeProvider>>;
}
export { Server };
//# sourceMappingURL=server.d.ts.map
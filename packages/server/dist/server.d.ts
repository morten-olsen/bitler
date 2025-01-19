import fastify, { FastifyRequest } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { Container, Session } from '@bitlerjs/core';
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
declare class Server {
    #private;
    constructor(container: Container);
    create: ({ setup, auth }?: CreateOptions) => Promise<fastify.FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, fastify.FastifyBaseLogger, ZodTypeProvider>>;
}
export { Server, type AuthOptions };
//# sourceMappingURL=server.d.ts.map
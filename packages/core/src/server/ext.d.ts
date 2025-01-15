import 'fastify';
import type { FastifyZod } from 'fastify-zod';

import { Container } from '../container/container.ts';

// Global augmentation, as suggested by
// https://www.fastify.io/docs/latest/Reference/TypeScript/#creating-a-typescript-fastify-plugin
declare module 'fastify' {
  type FastifyInstance = {
    readonly zod: FastifyZod<typeof models>;
  };

  type FastifyRequest = {
    container: Container;
  };
}

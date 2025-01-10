import 'fastify';
import type { FastifyZod } from "fastify-zod";
import { Container } from '../container/container.ts';

// Global augmentation, as suggested by
// https://www.fastify.io/docs/latest/Reference/TypeScript/#creating-a-typescript-fastify-plugin
declare module "fastify" {
  interface FastifyInstance {
    readonly zod: FastifyZod<typeof models>;
  }

  interface FastifyRequest {
    container: Container;
  }
}

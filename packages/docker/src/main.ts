import 'dotenv/config';

import { builtIn, Container, Extensions } from '@bitlerjs/core';
import { homeassistant } from '@bitlerjs/homeassistant';
import { timers } from '@bitlerjs/timers';
import { music } from '@bitlerjs/music';
import { linear } from '@bitlerjs/linear';
import { game } from '@bitlerjs/game';
import { signal } from '@bitlerjs/signal';
import { jsonDocuments } from '@bitlerjs/json-documents';
import { llm } from '@bitlerjs/llm';
import { knowledgeBases } from '@bitlerjs/knowledge-bases';
import { notifications } from '@bitlerjs/notifications';
import { http } from '@bitlerjs/http';
import { aws } from '@bitlerjs/aws';
import { todos } from '@bitlerjs/todos';
import { conversations } from '@bitlerjs/conversations';
import fastifyStatic from '@fastify/static';
import { frontendBundleRoot } from '@bitlerjs/frontend';
import { Server } from '@bitlerjs/server';

const container = new Container();

const extensionsService = container.get(Extensions);
await extensionsService.register([
  builtIn,
  llm,
  todos,
  aws,
  notifications,
  knowledgeBases,
  timers,
  game,
  jsonDocuments,
  homeassistant,
  music,
  linear,
  signal,
  http,
  conversations,
]);

const server = container.get(Server);
const app = await server.create({
  setup: async ({ app }) => {
    await app.register(fastifyStatic, {
      root: frontendBundleRoot,
      wildcard: false,
    });
  },
});

await app.listen({
  port: 3000,
  host: process.env.HOST,
});

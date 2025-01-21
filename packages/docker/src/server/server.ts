import 'dotenv/config';

import { builtIn, Capabilities, Container, Extensions, z } from '@bitlerjs/core';
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
import { openai } from '@bitlerjs/openai';
import { ollama } from '@bitlerjs/ollama';
import { gemini } from '@bitlerjs/gemini';

import { AuthService } from '../auth/auth.service.js';
import { createToken } from '../auth/auth.capabilities.js';

const container = new Container();

process.on('unhandledRejection', (error) => {
  console.error(error);
});
const capabilitiesService = container.get(Capabilities);
capabilitiesService.register([createToken]);
const extensionsService = container.get(Extensions);
await extensionsService.register([
  builtIn,
  llm,
  todos,
  aws,
  openai,
  ollama,
  gemini,
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
  auth: async ({ container, request }) => {
    const authService = container.get(AuthService);
    const [type, token] = request.headers.authorization?.split(' ') || [];
    if (!token || type !== 'Bearer') {
      throw new Error('Unauthorized');
    }
    await authService.verifyToken(token, z.unknown());
  },
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

console.log('Server started');
